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
       data:result 
      });
    });
  });
});

// ไม่ต้องเชื่อมต่อฐานข้อมูล
// con.end(); 

app.set('view engine', 'ejs');

app.listen(port, () => console.log('Server is running on port 3000'));

/* const query = SELECT * FROM board WHERE token = '${neme}' ORDER BY id DESC LIMIT 1;
  dbConnection.query(query)
      .then(result => {
          if (result.rows.length > 0) {
              const sensorData = {
                  temperature: result.rows[0].temperature,
                  humidity: result.rows[0].humidity,
                  pHValue: result.rows[0].phvalue,
                  soilMoisture: result.rows[0].soilmoisture,
                  boardname: result.rows[0].boardname
              };
              sendSensorData(sensorData);
          }
      })
      .catch(error => console.error('Error watching sensor data:', error)); 
      
      const nemeValue = req.query.neme;
    res.render('board', { nemeValue: nemeValue });
      
      
      */