import { admin, v1 } from './routes/index.js';
import express from 'express';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/storage', express.static(path.join(process.cwd(), 'src/storage')));

app.use('/api/admin', admin);
app.use('/api/v1', v1);

export default app;