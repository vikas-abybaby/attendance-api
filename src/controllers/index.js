import * as userControllers from './userController.js';
import * as roleControllers from './roleController.js';
import * as departmentControllers from './departmentController.js';
import * as designationControllers from './designationController.js';
import attendanceControllers from './attendances/index.js';
import groupControllers from './group/index.js';

export default {
  userControllers,
  roleControllers,
  attendanceControllers,
  departmentControllers,
  designationControllers,
  groupControllers,
};
