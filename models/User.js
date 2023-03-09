import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  online: Boolean,
  documents: [
    {
      documentId: mongoose.Schema.Types.ObjectId,
      role: String,
      title: String,
    },
  ],
});

export default mongoose.model("User", User);
