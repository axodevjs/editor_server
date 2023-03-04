import mongoose, {mongo} from "mongoose";

const Invite = new mongoose.Schema({
    role: {type: String},
    documentId: {type: mongoose.Schema.Types.ObjectId},
})

export default mongoose.model('Invite', Invite);