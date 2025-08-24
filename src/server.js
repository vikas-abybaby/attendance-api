import sequelize from "./config/connection.js";
import app from './app.js';

sequelize
  .sync({ alter: true })  
  .then(() => {
    console.log("Tables created/updated!");
  })
  .catch((err) => {
    console.error("Error syncing:", err);
  });
  
app.listen(8001, () => {
    console.log(`API listening at http://192.168.0.116:8001`);
});
