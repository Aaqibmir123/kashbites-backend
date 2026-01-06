import cloudinary from "../../config/cloudinary.js";
import SupportConversation from "../../models/SupportConversation.js";
import SupportMessage from "../../models/SupportMessage.js";

/* ================= GET OR CREATE CONVERSATION ================= */
export const getUserConversation = async (req, res) => {
  try {
    const userId = req.user._id;

    let conversation = await SupportConversation.findOne({ userId });

    if (!conversation) {
      conversation = await SupportConversation.create({
        userId,
      });
    }

    res.json({
      success: true,
      conversationId: conversation._id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



/* ================= SEND USER MESSAGE (HYBRID) ================= */
export const sendUserMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId required",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // ✅ CLOUDINARY UPLOAD
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "kashbites/support",
          quality: "auto",
          fetch_format: "auto",
        });

        // ✅ ONLY STRING (schema ke mutabiq)
        images.push(result.secure_url);

      
      }
    }

    const message = await SupportMessage.create({
      conversationId,
      senderRole: "user",
      senderId: req.user._id,
      text: text || "",
      images, // ✅ [String]
    });

    return res.json({
      success: true,
      data: message,
    });
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



/* ================= GET USER MESSAGES ================= */
export const getUserMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await SupportMessage.find({
      conversationId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
