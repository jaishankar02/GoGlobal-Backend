import passwordOperation from "../helpers/passwordHashing.js";
import userModal from "../models/userModel.js";
import jwt from 'jsonwebtoken';
// import userModal from './../models/userModel';
class userController {
    static userRegistration = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            // console.log(name, email, password, role);
            if (name && email && password) {
                const user = await userModal.findOne({ email });
                if (user) {
                    res.status(200).send({
                        success: false,
                        message: 'User Already Exist Please Try To Login'
                    });
                } else {
                    // if user not exit save its data 
                    const hashedPassword = await passwordOperation.hashPassword(password);
                    const newUser = new userModal({
                        name: name,
                        email: email,
                        password: hashedPassword
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

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await userModal.findOne({ email });
                if (user) {
                    const isPasswordCorrect = await passwordOperation.comparePassword(password, user.password);
                    if (isPasswordCorrect) {
                        const accessToken = jwt.sign({ name: user.name, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                        const refreshToken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5d' });
                        await userModal.updateOne({ _id: user._id }, { $set: { refreshToken: refreshToken } });
                        res.cookie('jwt', refreshToken, { maxAge: 24 * 60 * 60 * 1000 });
                        res.cookie('jwtAccess', accessToken, { maxAge: 24 * 60 * 60 * 1000 });
                        res.status(200).send({
                            success: true,
                            message: 'Login Successfull',
                            user: {
                                name: user.name,
                                email: user.email,
                                _id: user._id,
                                role: user.role
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
export default userController;