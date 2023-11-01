import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        require: true,
    },
    productcategory: {
        type: String,
        require: true
    },
    productDescription: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    productColor: {
        type: String,
        require: true
    },
    productSize: {
        type: String,
        require: true
    },
    sellerId: {
        type: String,
        require: true
    },
    productImage: {
        type: String,
        require: true
    }
})
const productModal = mongoose.model('Products', productSchema);
export default productModal;