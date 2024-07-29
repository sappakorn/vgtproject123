const mysql = require('mysql');

// การตั้งค่าการเชื่อมต่อกับฐานข้อมูล MySQL
const con = mysql.createConnection({
  host: 'db',
  user: 'root',
  password:'root',
  database: 'my-db'
});

con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

 
/* var con = mysql.createConnection({
    host: "node60666-vgtproject.th1.proen.cloud",
    user: "root",
    password: "OZIxac77163",
    database: "databasevgtproject"
}); */   

module.exports = con;