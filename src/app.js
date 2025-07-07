import { admin, v1 } from './routes/index.js';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin', admin);
app.use('/api/v1', v1);

export default app;