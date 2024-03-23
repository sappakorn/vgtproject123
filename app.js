const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs')
const app = express();
const port = 3000;


app.set('view engine', 'ejs');

var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("You are connectedd!");
  con.query("SELECT * FROM userprofile", function (error, result, fields) {
    if (error) throw error;
    console.log(result);

    app.get('/', (req, res) => {
      res.render('index', {
        data: result
      });
      
    });

  });
});


app.listen(port, () => console.log('Server is running on port 11991'));
