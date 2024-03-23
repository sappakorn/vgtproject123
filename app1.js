const express = require('express')
const mysql = require('mysql')
const app = express();
const port = 3000

var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("You are connected!");
});
con.end(); 

app.set('view engine' , 'ejs')

app.get('/',(req,res)=>{
  res.render('pages/index')
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
  
})



app.listen(port, ()=> console.log('server is running on port 3000'));