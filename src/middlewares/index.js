import { authMiddleware } from './user_access_validator.js';
import { allValidator } from './validator/allValidator.js';
import { photoUpload } from './upload/photo_upload.js';

export default { allValidator, authMiddleware, photoUpload };
