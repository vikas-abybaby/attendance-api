import forntend from './routes/forented/index.js';
import admin from './routes/admin/index.js';
import middlewares  from './middlewares/index.js';
import cors from "cors";
import express from 'express';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/storage', express.static(path.join(process.cwd(), 'src/storage')));

app.use('/api/v1', forntend);
app.use('/api/admin', admin);
app.use(middlewares.errorHandler);

export default app;