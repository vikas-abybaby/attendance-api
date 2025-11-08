import sequelize from "./config/connection.js";
import app from './app.js';
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Tables created/updated!");

    app.listen(8001, () => {
      console.log(`API running at http://10.241.172.249:8001`);
    });
  })
  .catch((err) => {
    console.error("Error syncing:", err);
  });

