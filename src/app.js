import forntend from './routes/forented/index.js';
import admin from './routes/admin/index.js';

import express from 'express';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/storage', express.static(path.join(process.cwd(), 'src/storage')));

app.use('/api/app', forntend);
app.use('/api/admin', admin);

export default app;