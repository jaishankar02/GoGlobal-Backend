import productModal from "../models/productModel.js";
import jwt from 'jsonwebtoken';
import buyerModel from "../models/sellerModel.js";
import multer from 'multer';
class productController {
    static addProduct = async (req, res) => {
        const authHeader = req.headers['authorization'];
        let sellerid;
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Assumes "Bearer" format
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(decodedToken);
            if (!decodedToken) {
                res.status(403).send({
                    success: false,
                    message: 'forbidden'
                });
            }
            else {
                sellerid = decodedToken.seller_id;
            }

        }
        else {
            res.status(403).send({
                success: false,
                message: 'forbidden'
            });
        }
        const { productname, productcategory, productDescription, price, productColor, productSize } = req.body;
        const file = req.file;
        console.log(file);
        const fileName = file.filename;
        console.log(productname);
        if (productname && productcategory && productDescription && price && productColor && productSize) {
            console.log(productname);

            // upload.array('images', 4);
            // const files = req.files;
            // if()
            const newProduct = new productModal({
                productname, productcategory, productDescription, price, productColor, productSize, sellerId: sellerid, productImage: fileName
            });
            await newProduct.save();
            await buyerModel.updateOne({ _id: sellerid }, { $push: { products: newProduct._id } });
            res.status(201).send({
                message: 'product Created',
                newProduct
            });


            // await userModal.updateOne({ _id: user._id }, { $set: { refreshToken: refreshToken } });
            // res.status(200).send({
            //     message: "done"
            // })
        }
        else {
            res.status(400).send({
                success: false,
                message: "please provide all the required fields"
            });
        }
    }

    static selectByCategory = async (req, res) => {
        console.log("azad");
        const { productcategory } = req.body;
        console.log(productcategory)
        console.log(productcategory);
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Assumes "Bearer" format
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(decodedToken);
            if (!decodedToken) {
                res.status(403).send({
                    success: false,
                    message: 'forbidden'
                });
            }
            console.log("jai");
            const productArr = await productModal.find({ productcategory: productcategory });
            // console.log(productArr);
            if (!productArr) {
                res.status(400).send({
                    success: false,
                    message: "Error Occured"
                });
            }
            else {
                if (productArr.length > 0) {
                    console.log(productArr);
                    res.status(200).send({
                        message: "products selected",
                        productArr
                    });
                }



            }
        }
        else {
            res.status(403).send({
                success: false,
                message: 'forbidden'
            });
        }

    }

    static getProducts = async (req, res) => {
        const AllProductArr = await productModal.find();
        res.status(200).send({
            message: "All Products",
            AllProductArr
        })
    }
    static getFeaturedProduct = async (req, res) => {
        const featuredProduct = await productModal.find().limit(3);
        res.status(200).send({
            message: "Featured Product",
            featuredProduct
        })
    }

    static getSingleProduct = async (req, res) => {
        const { productId } = req.body;
        console.log(req.body);

        const product = await productModal.findOne({ _id: productId });
        res.status(200).send({
            message: 'product found',
            product
        })
    }

}


export default productController;