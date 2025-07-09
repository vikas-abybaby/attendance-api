import express from 'express';
import userAddRouter from './userAdd.js';
import userEditRouter from './userEdit.js';
import userGetRouter from './userGet.js';
import userLoginRouter from './userLogin.js';
import userCalebrationRouter from './userCalebration.js';

const router = express.Router();

router.use(userGetRouter);
router.use(userAddRouter);
router.use(userEditRouter);
router.use(userLoginRouter);
router.use(userCalebrationRouter);

export default router;

