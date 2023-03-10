import mongoose from "mongoose";

const Document = new mongoose.Schema({
  title: { type: String },
  users: [
    { role: String, userId: mongoose.Schema.Types.ObjectId, email: String },
  ],
  content: { type: String },
});

export default mongoose.model("Document", Document);
