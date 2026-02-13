import mongoose from "mongoose";

const documentChatMessageSchema = new mongoose.Schema(
  {
    firebase_uid: { type: String, required: true, index: true },
    session_id: { type: String, required: true },
    action: { type: String, enum: ["upload", "ask"], required: true },
    file_name: { type: String },
    query: { type: String },
    response: { type: String },
    response_time_ms: { type: Number },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

documentChatMessageSchema.index({ firebase_uid: 1, createdAt: -1 });

export default mongoose.model("DocumentChatMessage", documentChatMessageSchema);
