const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login_db",
});

connection.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
    return;
  }

  console.log("Database Connected Successfully");
});

module.exports = connection;