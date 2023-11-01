import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
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
        default: 2,
        require: true
    },
    state: {
        type: Number,
        require: true
    },
    brandName: {
        type: String,
        require: true,
    },
    aadharCard: {
        type: String,
        require: true
    },
    panNumber: {
        type: String,
        require: true
    },
    products: [String]
}, { timestamps: true });
const buyerModel = mongoose.model('buyer', buyerSchema);
export default buyerModel;