const mysql = require('mysql');

// การตั้งค่าการเชื่อมต่อกับฐานข้อมูล MySQL
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'my-db',
  // port:3377 //nu kak
});

con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

 

module.exports = con;