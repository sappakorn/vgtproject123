const mysql = require('mysql');
require('dotenv').config();

//ทดลองบนเครื่อง
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'my-db',
  //port:3377 
});
 

//บน server cloud
/*const con = mysql.createConnection({
  host: process.env.DB_HOSR,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port:process.env.DB_PORT
});
 */
con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

 

module.exports = con;