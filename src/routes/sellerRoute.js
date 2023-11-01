import express from 'express'
import sellerController from '../controller/sellController.js';

const sellerRouter = express.Router();

sellerRouter.post('/sellerLogin', sellerController.sellerLogin);
sellerRouter.post('/sellerRegister', sellerController.sellerRegistration);
export default sellerRouter;