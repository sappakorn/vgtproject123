const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 11991;

var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject",

});

con.connect(function (err) {
  if (err) throw err;
  console.log("You are connectedd!");
  con.query("SELECT * FROM userprofile", function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    console.log("ejs ??? ")
    app.get('/', (req, res) => {
      res.render('pages/index', {
        data: result
      });
    });
  });
});

app.set('view engine', 'ejs');

app.listen(port, () => console.log('Server is running on port 3000'));
