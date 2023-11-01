import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: Number,
        default: 1,
        require: true
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

const userModal = mongoose.model('User', userSchema);

export default userModal;