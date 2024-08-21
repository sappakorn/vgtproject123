const express = require('express');
const app = express();
const port = process.env.PORT || 3301;
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
const ejs = require('ejs');
const path = require('path');
const con = require('./models/config/database')
const cors = require('cors')
app.use(cors());
app.use(express.json());

//สร้างcookie_session 
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 3600 * 1000, // 1 ชม.
  secure: false, // ใช้งานใน Product จริงให้ใช้ true
  httpOnly: true // ช่วยป้องกันการโจมตีแบบ XSS
}));
// สร้างคีย์ 
function generateSessionKey() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  generateSessionKey
};

app.use((req, res, next) => {
  req.session.user = req.session.user || {};
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//login
const authLoginRouter = require('./api/auth/login');
app.use('/api/auth/login', authLoginRouter);

//login customer_login
const authlogincustomer = require('./api/auth/customer_login');
app.use('/api/auth/ctm_login', authlogincustomer)

const show_no_loginRouter = require('./controller/show_no_login'); // โชว์หน้าสินค้าแบบยังไม่ login
app.use('/show_no_login', show_no_loginRouter);

app.get('/customer_login', function (req, res) { //แสดงหน้า login ของลูกค้า
  res.render('pages/customer_login', {}) 
})

/* เช็คว่ามี session.key หรือไม่  */
const checkKey = (req, res, next) => {
  if (!(req.session.user && req.session.user.key) && !(req.session.customer && req.session.customer.key)) {
    return res.status(401).send("Unauthorized. Please log in first.");
  }
  next();
};

// กำหนดให้ middleware ตรวจสอบคีย์ก่อนที่จะทำการเข้าถึงหน้าต่าง ๆ
app.use(['/menu', '/home', '/add_product', '/stock', '/qrcode', '/history', '/receipt', '/cart', '/upload', 'history_info', 'history', 'customer_home'], checkKey);
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist')); // Serve Bootstrap CSS โดยใช้ express.static()


app.get('/', function (req, res) { //หน้าแรกของเว็บ

  try {
    store_list = "select phone,user_id,name_shop,location_shop from usersprofile"
    con.query(store_list, function (error, result) {
      if (error) {
        return console.log("select error")
      }
      res.render('pages/index', {
        list_store: result,
      })
    });
  } catch (error) {
    return console.log("select error")
  }
})

app.get('/index1', function (req, res) {
  res.render('pages/index1', { session: req.session })
})

app.get('/menu', function (req, res) { //แสดงเมนูของร้าน
  res.render('pages/menu', {});
});

app.get('/customer_register', function (req, res) { //แสดงหน้า Register ของลูกค้า
  res.render('pages/customer_register', {})
})

const authLogoutRouter = require('./api/auth/logout')
app.use('/api/auth/logout', authLogoutRouter)

//สมัคร
const authcustomer_regis = require('./api/auth/customer_register');
app.use('/api/auth/ctm_register', authcustomer_regis);

//api สมัครลูกค้า
const authRegisterRouter = require('./api/auth/register');
app.use('/api/auth/register', authRegisterRouter);

// แสดงประวัติทุกอย่างเป็น card
const history = require('./models/history');
app.use('/history_card', history);

// แสดงรายละเอียดประวัติ
const history_info = require('./models/history_info')
app.use('/history_info', history_info)

//route register
app.get('/register', function (req, res) {
  res.render('pages/register', {});
});
//

app.get('/paylater', function (req, res) {
  res.render('pages/paylater', {});
});

//qrcode
app.get('/qrcode', function (req, res) {
  res.render('pages/qrcode', {});
});

//แก้ไขสต็อกสินค้า
const edit_stockRoute = require('./controller/edit_stock')
app.use('/edit_stock',edit_stockRoute);



//ใบเสร็จร้านค้า
const receiptRoute = require('./controller/receipt')
app.use('/receipt',receiptRoute)

//หลังจากจบการขายของ แม่ค้า
app.get('/end_of_sale', function (req, res) {
  req.session.cartItems = null;
  console.log(req.session.cartItems)

  return res.render('pages/receipt', { messageerror: "ทำรายการสำเร็จ" });
})

//หน้า home  มีการแสดงสินค้า
const homeRoute = require('./controller/home')
app.use('/home',homeRoute);

//โชว์สินค้าของร้านที่ลูกค้าเลือก
const customer_product_listRoute = require('./controller/customer_product_list')
app.use('/customer_product_list',customer_product_listRoute)

//แสดงหน้าร้านค้า สำหรับลูกค้าที่ login
const customer_homeRoute = require('./controller/customer_home')
app.use('/customer_home',customer_homeRoute);

//นำสินค้าที่ถูกส่งโดย Ajax มาที่เก็บไว้ใน session ฝั่ง nodejs 
app.post('/confirm_order', (req, res) => {
  req.session.cart123 = req.body.cart;
  /* console.log(req.body.cart) */
  console.log(req.session.cart123)
  res.status(200).send('Data received');
});

const confirm_orderRoute = require('./controller/confirm_order')
app.use('/confirm_order',confirm_orderRoute)


// แสดงสินค้าที่มาจากตะกร้าสินค้า ใช้ produclist ในการ เช็กเงื่อนไขต่อ 
/* const customer_checkoutRoute =require('./api/auth/customer_checkout')
app.use('/customer_checkout',customer_checkoutRoute) */


const customer_receiptRoute = require('./controller/customer_receipt')
app.use('/customer_receipt',customer_receiptRoute );



// ไปที่หน้า เพิ่มสินค้า 
app.get('/add_product', function (req, res) {
  res.render('pages/add_product')
});

//show stock
const stockRoute = require('./controller/stock')
app.use('/stock',stockRoute)

// เมื่อมีการคลิกปุ่ม "เพิ่ม" ของร้านค้า 
const add_to_cardRoute = require('./api/auth/add_to_card')
app.use('/add_to_cart',add_to_cardRoute)

// delete items
app.get('/delete_all', function (req, res) {
  req.session.cartItems = null
  console.log(req.session.cartItems)
  res.redirect('/cart');
})

// ปุ่มลดสินค้า ฝั่งร้านค้า
const decrease_productRoute = require('./api/auth/decrease_product')
app.use('/decrease_product',decrease_productRoute)

//ปุ่มเพิ่มสินค้า ฝั่งร้านค้า
const increase_productRoute = require('./api/auth/increase_product')
app.use('/increase_product',increase_productRoute)

//นับจำนวนสินค้า
app.get('/cart_items_count', function (req, res) {

  if (req.session.cartItems == undefined) {
    res.json({ count: 0 });
  } else {
    const count = req.session.cartItems.length;
    res.json({ count: count });
  }

});




//แสดง cart 
const cartRoute = require('./controller/cart')
app.use('/cart',cartRoute)

// ลบรายกา ตามตำแหน่ง Arrays 
const remove_item_cartRoute = require('./api/auth/remove-item-cart')
app.use('/remove-item-cart',remove_item_cartRoute)

//รวมราคาสินค้า แหละ ตัดสต็อก
const authSummaryRouter = require('./api/auth/summary');
app.use('/api/auth/summary', authSummaryRouter)





/*เงื่อนไขอัพโหลดไฟล์เข้าserver และ อัพโหลดข้อมูลต่างๆ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // ส่งไฟล์ไปยัง โฟลเดอ uplads
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // สร้างชื่อไฟล์
  }
});

const checkslipRoute = require('./api/auth/checkslip');
app.use('/api/checkslip', checkslipRoute )


const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('กรุณาเลือกรูป');
  }
  const user_id = req.session.user.id;
  if (!user_id) {
    return res.status(401).send('Unauthorized. Please login first.');
  }
  const productname = req.body.productname;
  const unit = req.body.unit;
  const price = req.body.price;
  const quantity = parseInt(req.body.quantity);
  const product_type = req.body.productType;
  const product_img = req.file.filename;
  const path_uploads = "uploads/";
  const fullpath = path_uploads + product_img;
  const add_stock = "INSERT INTO products (productname, unit , price, quantity, product_img,product_type, user_id) VALUES (?, ?, ?, ?, ?, ?,?)";

  con.query(add_stock, [productname, unit, price, quantity, fullpath, product_type, user_id], function (err, result) {
    if (err) {
      console.log(err)
      return res.status(500).send('กรุณากรอกข้อมูลให้ถูกต้อง');
    }
    res.redirect("/home");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});


