import mongoose, {Schema} from "mongoose";
import User from "./User.js";

const Document = new mongoose.Schema({
    title: {type: String},
    users: [{role: String, userId: mongoose.Schema.Types.ObjectId, username: String}],
    commits: {type: Array},
    content: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId}
})

export default mongoose.model('Document', Document);