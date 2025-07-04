const express = require('express');

const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin', routes.admin);
app.use('/api/frontend', routes.user);

module.exports = app;