import attendanceServices from './attendances/index.js';
import groupServices from './group/index.js';
import * as userServices from './userService.js';
import * as roleServices from './roleService.js';
import * as departmentServices from './departmentServices.js';
import * as designationServices from './designationServices.js';


export default {
    ...userServices,
    attendanceServices,
    groupServices,
    roleServices,
    departmentServices,
    designationServices,
};