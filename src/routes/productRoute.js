import express from 'express'
import productController from '../controller/productController.js';
import multer from 'multer';
const productRouter = express.Router();
const storage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".jpeg");
    }
});

const upload = multer({ storage: storage });
productRouter.post('/addProduct', upload.single('productImages'), productController.addProduct);
productRouter.post('/selectByCategory', productController.selectByCategory);
productRouter.get('/getAllProduct', productController.getProducts);
productRouter.get('/featuredProduct', productController.getFeaturedProduct);
productRouter.post('/getProduct', productController.getSingleProduct);
export default productRouter;