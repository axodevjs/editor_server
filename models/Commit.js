import mongoose, { Schema } from "mongoose";

const Commit = new mongoose.Schema({
  title: { type: String },
  users: [
    {
      role: String,
      userId: mongoose.Schema.Types.ObjectId,
      username: String,
      email: String,
    },
  ],
  content: { type: String },
});

export default mongoose.model("Document", Commit);
