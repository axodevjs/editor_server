import mongoose from "mongoose";

const Comment = new mongoose.Schema({
  commitId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
  email: { type: String },
  text: { type: String },
  date: { type: Date },
});

export default mongoose.model("Comment", Comment);
