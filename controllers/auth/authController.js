import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

/* =================================================
   LOGIN WITH PHONE → SEND OTP (MSG91)
================================================= */
export const loginWithPhone = async (req, res) => {
  try {
    console.log("🔥 loginWithPhone HIT");
    console.log("📦 BODY:", req.body);

    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required",
      });
    }

    const ADMIN_NUMBER = "9596523404";
    const role = phone === ADMIN_NUMBER ? "admin" : "user";

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, role });
    }

    // ✅ CORRECT MSG91 OTP CALL (NO TEMPLATE)
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile: `91${phone}`,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📩 MSG91 RESPONSE:", response.data);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      userId: user._id,
    });
  } catch (error) {
    console.log("SEND OTP ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "OTP send failed",
    });
  }
};



/* =================================================
   VERIFY OTP (MSG91) → JWT LOGIN
================================================= */
export const verifyOtp = async (req, res) => {
  
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Phone & OTP required" });
    }

    // ✅ VERIFY OTP VIA MSG91
    await axios.post("https://control.msg91.com/api/v5/otp/verify", {
      otp,
      mobile: `91${phone}`,
      authkey: process.env.MSG91_AUTH_KEY,
    });

    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // ✅ JWT TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId,
      },
      token,
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error.response?.data || error.message);
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP" });
  }
};

/* =================================================
   SAVE PUSH TOKEN (NO CHANGE)
================================================= */
export const savePushToken = async (req, res) => {
  try {
    const { userId, pushToken } = req.body;

    if (!userId || !pushToken) {
      return res
        .status(400)
        .json({ success: false, message: "userId or pushToken missing" });
    }

    await User.findByIdAndUpdate(userId, { pushToken });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
