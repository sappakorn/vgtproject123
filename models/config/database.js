const mysql = require('mysql');

// การตั้งค่าการเชื่อมต่อกับฐานข้อมูล MySQL
/* const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'my-db',
  port:3377 
}); */

const con = mysql.createConnection({
  host: 'node66461-vgtproject.th1.proen.cloud',
  user: 'root',
  password:'RSNsed38760',
  database: 'my-db',
  port:3306 
});

con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

 

module.exports = con;