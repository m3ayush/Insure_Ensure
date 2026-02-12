import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    firebase_uid: { type: String, required: true, index: true },
    query: { type: String, required: true },
    response: { type: String, required: true },
    retrieved_chunks: [
      {
        chunk_id: String,
        score: Number,
        _id: false,
      },
    ],
    response_time_ms: { type: Number },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

chatMessageSchema.index({ firebase_uid: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
