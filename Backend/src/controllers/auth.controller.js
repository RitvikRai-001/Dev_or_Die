import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    console.log("Req body in /google:", req.body);
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    // 1. Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture, email_verified } = payload;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Google did not return an email" });
    }

    if (email_verified === false) {
      return res
        .status(400)
        .json({ message: "Google email is not verified" });
    }

    // 2. Find or create user
    let user = await User.findOne({
      $or: [{ googleId: sub }, { email }],
    });

    if (!user) {
      const usernameBase = email.split("@")[0];
      const username = usernameBase.toLowerCase();

      user = await User.create({
        username,
        email,
        fullname: name || usernameBase,
        avatar: picture,
        provider: "google",
        googleId: sub,
        role: "ranger",
      });
    } else {
      // link googleId if needed
      if (!user.googleId) {
        user.googleId = sub;
        user.provider = "google";
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
        await user.save();
      }
    }

    // 3. Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 4. ONE response: set cookies + send data
    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,   // localhost
        sameSite: "Lax",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      })
      .status(200)
      .json({
        message: "Google login successful",
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          fullname: user.fullname,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          provider: user.provider,
          isProfileComplete: user.isProfileComplete ?? false,
        },
      });
  } catch (err) {
    console.error("Google login error:", err);
    console.error("STACK >>>", err.stack);
    return res.status(500).json({
      message: "Google login failed",
      error: err.message,
    });
  }
};

export { googleLogin };
