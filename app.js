const express = require('express');
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs')
const app = express();
const port = 11512;
const bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


// Serve รูปภาพ ในไฟล์ public
app.use(express.static('public'));
//
// Serve Bootstrap CSS โดยใช้ express.static()
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
//

//เชื่อมต่อฐานข้อมูล
var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject"
});
//

app.get('/', function(req, res) {
  res.render('pages/index', { });
});

app.get('/register', function(req, res) {
  res.render('pages/register');
});

app.post('/auth_register', function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const phone_number = req.body.phone_number;
  const fullname = req.body.fullname;
  const sql = "INSERT INTO userprofile (username, password,password2,phone,fullname) VALUES (?,?,?,?,?)";
  con.query(sql, [username, password,password2,phone_number, fullname], function (err, result) {
    if (err) throw err;
    res.render('pages/index',{ });
  });
  
})




app.listen(port, () => console.log(`Server is running on port ${port}`));