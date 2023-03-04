import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: false, unique: false},
    password: {type: String, required: false},
    documents: Array
})

export default mongoose.model('User', User);