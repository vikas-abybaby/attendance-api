import { connectToMongo } from './db/index.js';
import app from './app.js';

connectToMongo();

app.listen(8001, () => {
    console.log(`API listening at http://192.168.0.116:8001`);
});
