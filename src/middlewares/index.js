import { authMiddleware } from './user_access_validator.js';
import { attendanceValidator } from './attendanceValidator.js';

export default { attendanceValidator, authMiddleware };
