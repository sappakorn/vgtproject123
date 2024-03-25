const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs')
const app = express();
const port = 11512;

app.set('view engine', 'ejs');

var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject"
});

app.get('/', function(req, res) {
  const sql = "SELECT * FROM userprofile";
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.render('pages/index', { data: result });
  });
});

app.get('/register', function(req,res){
  navigator('/pages/index')
})

const sql = "INSERT INTO userprofile (username, password, fullname) VALUES ('spk1','111111','Kspk')";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("1 record inserted");
});


app.listen(port, () => console.log(`Server is running on port ${port}`));