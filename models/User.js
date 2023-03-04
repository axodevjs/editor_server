import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: false, unique: true},
    password: {type: String, required: false}
})

export default mongoose.model('User', User);