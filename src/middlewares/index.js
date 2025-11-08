import { authMiddleware } from './user_access_validator.js';
import { allValidator } from './allValidator.js';
import { photoUpload } from './photo_upload.js';
import { errorHandler } from './errorHandler.js';

export default { allValidator, authMiddleware, photoUpload, errorHandler };
