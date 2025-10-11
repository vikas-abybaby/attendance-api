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
router.post(
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
router.patch(
    '/user-edit',
    [uploadProfile, userUpdate,],
    middlewares.authMiddleware,
    controllers.userControllers.userEdit
);
router.get(
    '/roles',
    middlewares.authMiddleware,
    controllers.roleControllers.roleGet
);
router.post(
    '/role-by-id',
    middlewares.authMiddleware,
    controllers.roleControllers.roleByIdGet
);
router.get(
    '/departments',
    middlewares.authMiddleware,
    controllers.departmentControllers.departmentGet
);
router.post(
    '/department-by-id',
    middlewares.authMiddleware,
    controllers.departmentControllers.departmentByIdGet
);
router.get(
    '/designations',
    middlewares.authMiddleware,
    controllers.designationControllers.designationGet
);
router.post(
    '/designation-by-id',
    middlewares.authMiddleware,
    controllers.designationControllers.designationByIdGet
);
router.post(
    '/birthday',
    middlewares.authMiddleware,
    controllers.userControllers.userBirthday
);
router.post(
    '/workAnniversary',
    middlewares.authMiddleware,
    controllers.userControllers.userWorkAnniversary
);
export default router;
