const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "equipment_db",
  password: "nigest11",
  port: 5432,
});

module.exports = pool;