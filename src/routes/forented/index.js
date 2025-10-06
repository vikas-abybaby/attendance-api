import express from 'express';
import controllers from '../../controllers/index.js';
import middlewares from '../../middlewares/index.js';
import validators from '../../validators/index.js';
const uploadProfile = middlewares.photoUpload("profile").single("profile_url");
const userCreate = middlewares.allValidator(validators.userCreate);
const userUpdate = middlewares.allValidator(validators.userUpdate);
const router = express.Router();

router.post(
    '/login',
    controllers.userControllers.userLogin,
);

router.get(
    '/profile',
    middlewares.authMiddleware,
    controllers.userControllers.userProfile,
);

router.get(
    '/users',
    middlewares.authMiddleware,
    controllers.userControllers.userGet,
);

router.post(
    '/user-add',
    [uploadProfile, userCreate,],
    middlewares.authMiddleware,
    controllers.userControllers.userAdd,
);

router.post(
    '/user-edit',
    [uploadProfile, userUpdate,],
    middlewares.authMiddleware,
    controllers.userControllers.userEdit
);


export default router;
