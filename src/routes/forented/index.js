const express = require('express');
const router = express.Router();
const userAddRouter = require('./users/userAdd');
const userEditRouter = require('./users/userEdit');
const userGetRouter = require('./users/userGet');
const userLoginRouter = require('./login/login');


router.use(userGetRouter, userAddRouter, userEditRouter,userLoginRouter);


module.exports = router;
