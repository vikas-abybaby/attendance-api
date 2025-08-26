import { authMiddleware } from './user_access_validator.js';
import { allValidator } from './validator/allValidator.js';
import { upload } from './upload/room_upload.js';

export default { allValidator, authMiddleware, upload };
