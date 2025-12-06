
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
    //Verification
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // payload typically has: sub, email, name, picture, email_verified, etc.
    const { sub, email, name, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google did not return an email" });
    }

    if (email_verified === false) {
    
      return res.status(400).json({ message: "Google email is not verified" });
    }


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
      // if existing local user, optionally link googleId
      if (!user.googleId) {
        user.googleId = sub;
        user.provider = "google";
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
        await user.save();
      }
    }

    // 4. Generate your own tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 5. Send response
    return res.status(200).json({
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
export {
    googleLogin
}
