import env from 'dotenv';
env.config();
import express from 'express';
import cors from 'cors';
import DB_connect from './config/DB_config.js';
import UserRouter from './routes/userRoute.js';
import refreshRouter from './routes/refreshRoute.js';
import cookieParser from 'cookie-parser';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
const server = express();
server.use(cors());

DB_connect(process.env.DB_URL);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static('public'));
server.use(cookieParser());

server.use('/api/user', UserRouter);
server.use('/api', refreshRouter);
server.use('/api/seller', sellerRouter);
server.use('/api/product', productRouter);

server.listen(process.env.PORT || 8000, () => {
    console.log('server started');
})
