import passwordOperation from "../helpers/passwordHashing.js";
import jwt from 'jsonwebtoken';
import buyerModel from "../models/sellerModel.js";
// import userModal from './../models/userModel';
class sellerController {
    static sellerRegistration = async (req, res) => {
        console.log('jai');

        try {
            // console.log(name, email, password, phone);
            console.log(req.body);
            const { name, email, password, phone, state, brandName, aadharCard, panNumber } = req.body;
            // console.log(name, email, password, role);
            console.log(name);
            if (name && email && password && phone && state && brandName && aadharCard && panNumber) {
                const user = await buyerModel.findOne({ email });
                if (user) {
                    res.status(200).send({
                        success: false,
                        message: 'Seller Already Exist Please Try To Login'
                    });
                } else {
                    // if user not exit save its data 
                    const hashedPassword = await passwordOperation.hashPassword(password);
                    const state1 = +state;
                    console.log(state1);
                    const newUser = new buyerModel({
                        name,
                        email,
                        password: hashedPassword,
                        phone,
                        state: state1,
                        brandName,
                        aadharCard,
                        panNumber
                    });
                    newUser.save();
                    res.status(201).send({
                        success: true,
                        message: 'User Successfully Created',
                        newUser
                    });
                }
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Please Provide All the Required Fields'
                });
            }
        }
        catch (err) {
            // if any server error occurs
            res.status(500).send({
                success: false,
                message: 'An Error Occurred During Registration',
                err
            });
        }
    }

    static sellerLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await buyerModel.findOne({ email });
                if (user) {
                    const isPasswordCorrect = await passwordOperation.comparePassword(password, user.password);
                    if (isPasswordCorrect) {
                        const accessToken = jwt.sign({ name: user.name, seller_id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                        const refreshToken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5d' });
                        await buyerModel.updateOne({ _id: user._id }, { $set: { refreshToken: refreshToken } });
                        res.cookie('Sellerjwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                        res.cookie('SellerjwtAccess', accessToken, { maxAge: 24 * 60 * 60 * 1000 });
                        res.status(200).send({
                            success: true,
                            message: 'Login Successfull',
                            user: {
                                name: user.name,
                                email: user.email,
                                _id: user._id,
                                role: user.role,
                                phone: user.phone,
                                state: user.state,
                                brandName: user.brandName,
                                describeBrand: user.describeBrand

                            },
                            accessToken,
                            refreshToken
                        });
                    } else {
                        res.status(401).send({
                            success: false,
                            message: 'Invalid Credential'
                        });
                    }
                } else {
                    // user does not exists in data base
                    res.status(401).send({
                        success: false,
                        message: 'Invalid Credentials'
                    });
                }
            }
            else {
                res.status(401).send({
                    success: false,
                    message: 'Please Provide All the Required Fields'
                });
            }
        }
        catch (error) {
            res.status(500).send({
                success: false,
                message: 'An Error Occured During Login',
                error
            });
        }
    }
}
export default sellerController;