import express from "express";
import {
  getUserConversation,
  getUserMessages,
  sendUserMessage,
} from "../../controllers/user/support.js";

import uploadSupport from "../../middleware/uploadSupport.js"; // 👈 chat multer

const router = express.Router();
router.get("/conversation", getUserConversation);
router.post(
  "/message",
  uploadSupport.array("images", 5), 
  sendUserMessage
);
router.get("/messages/:conversationId", getUserMessages);

export default router;
