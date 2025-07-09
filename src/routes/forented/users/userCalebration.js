import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';
import express from 'express';
const router = express.Router();


router.get('/calebration', middlewares.accessValidator, controllers.userControllers.userCalebration);

export default router;