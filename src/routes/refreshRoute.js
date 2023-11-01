import express from 'express';
import handleRefreshToken from '../controller/refreshController.js';
const refreshRouter = express.Router();
refreshRouter.post('/refresh', handleRefreshToken);
export default refreshRouter;