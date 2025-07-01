const connectToMongo = require('./db/connection');
const app = require('./app');

connectToMongo();


app.listen(8001, () => {
    console.log(`API listening at http://192.168.0.116:8001`);
});