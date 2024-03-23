const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("You are connectedd!");

  // Query ข้อมูลภายใน function con.connect()
  con.query("SELECT * FROM userprofile", function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    // ส่ง response กลับไปยัง client หลังจาก query เสร็จสมบูรณ์
    // โดยใช้ render method ของ EJS template engine
    app.get('/', (req, res) => {
      res.render('pages/index', { 
        data: result ,
      });
    });
  });
});

// ไม่ต้องเชื่อมต่อฐานข้อมูล
// con.end(); 

app.set('view engine', 'ejs');

app.listen(port, () => console.log('Server is running on port 3000'));
