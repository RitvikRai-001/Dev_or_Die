import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found while generating tokens");
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error("Something went wrong while generating refresh and access token");
    }
  };
  


const registerUser=asyncHandler(async (req ,res)=>{
    const {username,fullname,email,age,gender,role,password}=req.body;


    if (!username) {
        throw new Error("Username is required");
      }
    if (!fullname) {
        throw new Error("Full name is required");
      }
      
      if (!email) {
        throw new Error("Email is required");
      }
      
      if (!password) {
        throw new Error("Password is required");
      }
    
      if (!age || isNaN(age) || Number(age) <= 0) {
        throw new Error("Valid age is required");
      }
      
      if (!gender) {
        throw new Error("Gender is required");
      }
      
      if (!role) {
        throw new Error("Role is required");
      }
      
      const existedUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
      });
      if (existedUser) {
        throw new Error("User already exists");
      }
      const user=await User.create({
        
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        fullname: fullname.trim().toLowerCase(),

        age: Number(age),
        gender,
        role,
        password: password,
        provider: "local",
        isProfileComplete: true,
        

      

      })
      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      
      if (!createdUser) {
        throw new Error("Something went wrong while registering the user");
      }
      
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: createdUser
      })      
      

})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email) {
      throw new Error("Email is required");
    }
  
    if (!password) {
      throw new Error("Password is required");
    }
  
    const user = await User.findOne({ email: email.toLowerCase() });
  
    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.provider !== "local") {
      throw new Error("Please login using Google for this account");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new Error("Invalid user credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    // cookie options
    const options = {
      httpOnly: true,
      secure: true, 
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in successfully",
        user: loggedInUser,
      });
  });

  const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: user not found in request"
        });
      }
    
    await User.findByIdAndUpdate(req.user._id, {
      $set: { refreshToken: undefined }
    });
  
    const options = {
      httpOnly: true,
      secure: true
    };
  
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Logout successful"
      });
  });

  const updateAvatar = asyncHandler(async (req, res) => {
    if (!req.user._id) {
      throw new Error("Unauthorized: user not found");
    }
  
    
    if (!req.file || !req.file.path) {
      throw new Error("Avatar file is required");
    }
  
    const localFilePath = req.file.path;
  
    const uploadResult = await uploadOnCloudinary(localFilePath);
  
    if (!uploadResult || (!uploadResult.secure_url && !uploadResult.url)) {
      throw new Error("Failed to upload avatar");
    }
  
    const avatarUrl = uploadResult.secure_url || uploadResult.url;
  
  
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password -refreshToken");
  
    if (!updatedUser) {
      throw new Error("User not found while updating avatar");
    }
  
    
    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser
    });
  });

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  const {
    _id,
    username,
    fullname,
    email,
    age,
    gender,
    role,
    createdAt,
    weight,
    height,
    conditions,
    allergies,
    provider,
    isProfileComplete,
  } = req.user;

  res.status(200).json({
    success: true,
    user: {
      _id,
      username,
      fullname,
      email,
      age,
      gender,
      role,
      createdAt,
      weight,
      height,
      conditions,
      allergies,
      provider,
      isProfileComplete,   // ⭐ now frontend sees true/false correctly
    },
  });
});


const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    fullname,
    age,
    gender,
    role,

    // Ranger fields
    height,
    weight,
    conditions,
    allergies,

    // Doctor fields
    specialization,
    licenseNumber,
    experience,
  } = req.body;

  // 🚨 Role is mandatory
  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  // ✅ FETCH USER (you missed this)
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ───────── Common fields ─────────
  if (fullname) user.fullname = fullname;
  if (age !== undefined) user.age = age;
  if (gender) user.gender = gender;

  // ✅ Explicitly overwrite role
  user.role = role;

  // ───────── Clear old role data ─────────
  user.height = undefined;
  user.weight = undefined;
  user.conditions = undefined;
  user.allergies = undefined;
  user.specialization = undefined;
  user.licenseNumber = undefined;
  user.experience = undefined;

  // ───────── Role-based assignment ─────────
  if (role === "ranger") {
    user.height = height;
    user.weight = weight;
    user.conditions = conditions;
    user.allergies = allergies;
  }

  if (role === "doctor") {
    if (!specialization || !licenseNumber) {
      throw new ApiError(
        400,
        "Doctor profile requires specialization and license number"
      );
    }

    user.specialization = specialization;
    user.licenseNumber = licenseNumber;
    user.experience = experience;
  }

  user.isProfileComplete = true;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});


// const completeProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // from auth middleware

//   const {
//     age,
//     gender,
//     height,
//     weight,
//     conditions,
//     allergies,
//   } = req.body;

//   const updated = await User.findByIdAndUpdate(
//     userId,
//     {
//       age,
//       gender,
//       height,
//       weight,
//       conditions,
//       allergies,
//       isProfileComplete: true,
//     },
//     { new: true }
//   ).select("-password -refreshToken");

//   if (!updated) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }

//   res.json({
//     success: true,
//     message: "Profile completed successfully",
//     user: updated,
//   });
// });






  
  
export {
    registerUser,
    loginUser,
    logoutUser,
    updateAvatar,
    getCurrentUser,
    updateProfile,
    // completeProfile
}