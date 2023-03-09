import mongoose, { Schema } from "mongoose";

const Commit = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId },
  before: { type: String },
  after: { type: String },
  date: { type: Date },
  status: { type: String },
  email: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId },
  votesAccept: { type: Array },
  votesReject: { type: Array },
});

export default mongoose.model("Commit", Commit);
