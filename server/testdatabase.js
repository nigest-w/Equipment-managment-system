const pool = require("./config/database");

pool.connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });