const express = require('express');
const path = require('path'); 
const mysql = require('mysql');
const ejs = require('ejs')
const app = express();
const port = 3300;
const bodyParser = require('body-parser');


// ต้องเพิ่ม multer ที่จะใช้ในการจัดการไฟล์
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
// ระบุโฟลเดอร์ที่จะเก็บไฟล์


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve Bootstrap CSS โดยใช้ express.static()
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

var con = mysql.createConnection({
  host: "node60666-vgtproject.th1.proen.cloud",
  user: "root",
  password: "OZIxac77163",
  database: "myproject"
});

//หน้าแรก
app.get('/', function(req, res) {
    res.render('pages/index', { });
});
//

//login
app.post('/auth/login', (req,res)=>{
  const phone = req.body.phoneNumber;
  const password = req.body.password;

  if (!phone || !password) {
    return res.status(400).send("โปรดกรอกหมายเลขโทรศัพท์และรหัสผ่าน");
  }
  
  const sql = "select * from userprofile where phone = ? AND password = ? ";
  con.query(sql, [phone,password] , function(err, result) {
    if (err) throw err;

    if (result.length > 0) {
      res.redirect('/home'); 
    } else {
 
      res.status(401).send("เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบหมายเลขโทรศัพท์หรือรหัสผ่าน");
    }

  });

});
//

//เมื่อกดเข้าปุ่มสมัครมาชิกจะพาไปหน้า register
app.get('/register', function(req, res) {
  res.render('pages/register',{});
});
//

//หน้า home หลังจากที่ login มีการแสดงสินค้า
app.get('/home', function(req, res) {
  const selectprodcut = "select * from stock_product";
  con.query(selectprodcut, function(err,result){
    if(err) throw err;
    res.render('pages/home', { product_list: result });
  })
});
//

app.get('/add_product', function(req, res) {
  
    res.render('pages/add_product')
});

//upload stock_product     
/* app.post('/upload',upload.single('img'), function(req, res) {

  const productname = req.body.productname;
  const product_type = req.body.type;
  const price = req.body.price;
  const quantity = req.body.quantity;
  const product_img = req.file.filename;  
  const fullPath = pathPrefix.concat(product_img);
    

  const add_stock = "INSERT INTO stock_product(productname,product_type,price, quantity,product_img) VALUES (?,?,?,?,?)";
  con.query(add_stock,[productname, product_type, price, quantity, fullPath] ,function(err,result){
    if(err) throw err;
    res.render('pages/home',{
      product_list : result
    });

  })
}); */



//API สมัครสมาชิก แบบยังไม่มีเงื่อนไข 
app.post('/auth_register', function(req,res,error){
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const phone_number = req.body.phone_number;
  const fullname = req.body.fullname;
  const sql = "INSERT INTO userprofile (username, password,password2,phone,fullname) VALUES (?,?,?,?,?)";
  con.query(sql, [username, password,password2,phone_number, fullname], function (err, result) {
    if (err) throw err;
    res.render('pages/',{});
  });
  if(error){
    console.log(error)
  }
})
//

app.listen(port, () => console.log(`Server is running on port ${port}`));
