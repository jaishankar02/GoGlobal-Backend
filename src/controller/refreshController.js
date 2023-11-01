import jwt, { decode } from 'jsonwebtoken';
import userModal from '../models/userModel.js';
import { response } from 'express';
const handleRefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const user = await userModal.findOne({ refreshToken: refreshToken });
    if (!user) {
        return res.status(403).send({
            success: false,
            message: 'forbidden'
        });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err || user.name !== decode.name) {
            return res.status(403).send({
                success: false,
                message: 'forbidden'
            });
        }
        const accessToken = jwt.sign({ name: user.name, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        // res.cookie('jwtAccess', { maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).send({
            success: true,
            message: 'Access token created',
            accessToken
        });
    })
}
export default handleRefreshToken;