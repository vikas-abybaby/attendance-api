const express = require('express');
const connectToMongo = require('./db/connection');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const homeRoutes = require('./routes/home');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
connectToMongo();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/summary', homeRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leave', leaveRoutes);

app.listen(8001, () => {
    console.log(`API listening at http://192.168.0.112:8001`);
});