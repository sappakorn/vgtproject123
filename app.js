const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const PORT = process.env.PORT || 11512; //11512
const bodyParser = require('body-parser');
const multer = require('multer');
const con = require("./models/config/database");
const cookieSession = require('cookie-session');
const crypto = require('crypto');




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

  req.session.alert = {
    danger: false,
    success: false,
    warning: false,
    info: false
  };

  next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//login
const authLoginRouter = require('./api/auth/login');
app.use('/api/auth/login', authLoginRouter);


function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/menu');
  }
  next();
}




/* เช็คว่ามี session.key หรือไม่  */
const checkKey = (req, res, next) => {
  // ตรวจสอบว่ามี session key หรือไม่
  if (!req.session.user.key) {
    return res.status(401).send("Unauthorized. Please log in first.");
    
  }
  next();
  
};


// กำหนดให้ middleware ตรวจสอบคีย์ก่อนที่จะทำการเข้าถึงหน้าต่าง ๆ
app.use(['/menu', '/home', '/add_product','/stock', '/qrcode', '/history', '/receipt', '/cart','/upload'], checkKey);


// Serve Bootstrap CSS โดยใช้ express.static()
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

/* ใช้เรียก jquery */
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))

/* ajax */
app.use('/ajax', express.static(__dirname + '/node_modules/ajax/lib'))
//


app.get('/', function(req,res){
  res.render('pages/index',{ session: req.session })
})


//route menu
app.get('/menu', function (req, res) {
  res.render('pages/menu', {});
});




/* //หน้าแรก
const router = require('./api/apiroute/route');
app.use('/', router) */





const authLogoutRouter = require('./api/auth/logout')
app.use('/api/auth/logout', authLogoutRouter)

//สมัคร
const authRegisterRouter = require('./api/auth/register');
app.use('/api/auth/register', authRegisterRouter);




//route register
app.get('/register', function (req, res) {
  res.render('pages/register', {});
});
//



//qrcode
app.get('/qrcode', function (req, res) {
  res.render('pages/qrcode', {});
});



//ประวัติการขาย
app.get('/history', function (req, res) {
  res.render('pages/history', {});
});






//ใบเสร็จ
app.get('/receipt', function (req, res) {
  
  let sum = 0;
  req.session.cartItems.forEach(item => {
    count_p = item.count_product; //นับจำนวน
    totalprice = count_p * item.productPrice; //ราคาทั้งหมดของ product นั้น
    sum += totalprice; //ราคารวมทั้งหมด 
  });
  res.render('pages/receipt', {
    cart_item: req.session.cartItems, //ข้อมูลสินค้าที่อยู่ในตระกร้า
    totalPrice:  sum.toFixed(2)
  });

});

app.get('/end_of_sale',function (req,res){
  req.session.cartItems = null;
  console.log(req.session.cartItems)
  res.redirect('/home');
})


//หน้า home หลังจากที่ login มีการแสดงสินค้า
app.get('/home', function (req, res) {

  const id = req.session.user.id
  const selectProduct = `SELECT * FROM products WHERE user_id = ?  ORDER BY productname ASC `;

  con.query(selectProduct, [id], function (err, productResult) {
    if (err) throw err;
    const selectProductType = "SELECT DISTINCT product_type  FROM products WHERE user_id = ? " ;
    con.query(selectProductType, [id], function (err, typeResult) {
      if (err) throw err;
      res.render('pages/home', { product_list: productResult, type_list: typeResult });
    });
  });
});

//




app.get('/add_product', function (req, res) {
  res.render('pages/add_product')
});

app.get('/stock', function(req,res){
  const id = req.session.user.id
  const selectProduct = `SELECT * FROM products WHERE user_id = ?  ORDER BY productname ASC `;

  con.query(selectProduct, [id], function (err, productResult) {
    if (err) throw err;
    const selectProductType = "SELECT DISTINCT product_type  FROM products WHERE user_id = ? " ;
    con.query(selectProductType, [id], function (err, typeResult) {
      if (err) throw err;
      res.render('pages/stock', { product_list: productResult, type_list: typeResult });
    });
  });
})



// เมื่อมีการคลิกปุ่ม "เพิ่ม"
app.post('/add_to_cart', function (req, res) {

  const product_id = req.body.product_id;
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const productType = req.body.productType;
  const quantity  = parseInt(req.body.quantity);
  const trueqtt = quantity-1;

  let count_product = 1;

  // สร้าง session Oject สินค้า
  if (!req.session.cartItems) {
    req.session.cartItems = [];
  }

  const findProduct = req.session.cartItems.findIndex(item => item.product_id === product_id)
  if(findProduct !== -1){
    req.session.cartItems[findProduct].count_product += 1;
    req.session.cartItems[findProduct].quantity -= 1;
  }else{
    req.session.cartItems.push({
    product_id:product_id,
    productName: productName,
    productPrice: productPrice,
    productType: productType,
    count_product : count_product,
    quantity : trueqtt
    });
  }
  
  console.log(req.session);

  res.redirect('/home');
});

// delete items
app.get('/delete_all', function (req, res) {
  req.session.cartItems = null
  console.log(req.session.cartItems)
  res.redirect('/cart');
})

// ปุ่ม - 
app.post('/decrease_product',function (req,res){
    const productId = req.body.decrease_id;
    
    if (req.session.cartItems && Array.isArray(req.session.cartItems)) {

      // หารายการที่มี product_id ตรงกับที่ส่งมา               ฟังก์ชัน callback       
      const itemIndex = req.session.cartItems.findIndex(item => item.product_id === productId);
  
      if (itemIndex !== -1) {
      
        //ลบหนึงทุกครั้งที่ count_product มากกว่า 0
        if(req.session.cartItems[itemIndex].count_product > 0){
          req.session.cartItems[itemIndex].count_product -= 1;
          req.session.cartItems[itemIndex].quantity += 1;
          // count_product เหลือ 0 เอารายการออก
          if (req.session.cartItems[itemIndex].count_product === 0){
            req.session.cartItems.splice(itemIndex, 1);
          }

        }
      }
    }
    console.log(req.session.cartItems);
    res.redirect('/cart'); 

})

//ปุ่ม+
app.post('/increase_product', function(req, res) {
  const productId = req.body.increase_id;

  if (req.session.cartItems && Array.isArray(req.session.cartItems)) {
      // ค้นหาดัชนีของสินค้าที่ตรงกับ productId
      const itemIndex = req.session.cartItems.findIndex(item => item.product_id === productId);

      if (itemIndex !== -1) {
          // เช็คจำนวนสินค้าที่เหลือ
          const availableQuantity = req.session.cartItems[itemIndex].quantity;
          const countProduct = req.session.cartItems[itemIndex].count_product;

          // ตรวจสอบว่าเกิน availableQuantity หรือไม่
          if (availableQuantity === 0) {
              // alert แจ้งเตือน 
              console.log("สินค้าไม่เพียงพอ");
              res.redirect('/cart');
              return;
          }

          // เพิ่มจำนวน count_product และลด availableQuantity ถ้ามีสินค้าเหลืออยู่
          req.session.cartItems[itemIndex].count_product += 1;
          req.session.cartItems[itemIndex].quantity -= 1;
      }
  }

  console.log(req.session.cartItems);
  res.redirect('/cart');
});


//นับจำนวนสินค้า
app.get('/cart_items_count', function (req, res) {

  if (req.session.cartItems == undefined) {
    res.json({ count: 0 });
  } else {
    const count = req.session.cartItems.length;
    res.json({ count: count });
  }

});


//API cart
app.get('/cart', function (req, res) {
  let sum = 0;
  if (!req.session.cartItems || req.session.cartItems.length === 0) {
    res.render('pages/cart', {
      totalPrice: sum,
      cart_item: [] // ส่งอาร์เรย์ว่างไปยังหน้า cart เพื่อให้แสดงคำว่า "ว่าง"
    });
  } else {
    req.session.cartItems.forEach(item => {
      count_p = item.count_product;
      totalprice = count_p * item.productPrice;
      sum += totalprice;
    });
    res.render('pages/cart', {
      cart_item: req.session.cartItems,
      totalPrice: sum
    });
  }
});

// ลบรายกา ตามตำแหน่ง Arrays 
app.post('/remove-item-cart', (req, res) => {
  const itemIndex = parseInt(req.body.itemIndex);

  if (req.session.cartItems && Array.isArray(req.session.cartItems)) {
    // ตรวจสอบให้แน่ใจว่า index อยู่ในช่วงของอาเรย์
    if (itemIndex >= 0 && itemIndex < req.session.cartItems.length) {
      req.session.cartItems.splice(itemIndex, 1); // ลบรายการที่ตำแหน่งที่ระบุ
    }
  }
  console.log(req.session.cartItems)
  res.redirect('/cart'); // กลับไปยังหน้าก่อนหน้า
});


//รวมราคาสินค้า แหละ ตัดสต็อก
const authSummaryRouter = require('./api/auth/summary');
const { count } = require('console');
app.use('/api/auth/summary', authSummaryRouter)





/*เงื่อนไขอัพโหลดไฟล์เข้าserver และ อัพโหลดข้อมูลต่างๆ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // save uploaded files to uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // generate unique filename
  }
});

const upload = multer({ storage: storage });

 app.post('/upload', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const user_id = req.session.user.id;

 
  if (!user_id) {
    return res.status(401).send('Unauthorized. Please login first.');
  }

  

  const productname = req.body.productname;
  const unit  = req.body.unit;
  const price= req.body.price;
  const quantity = parseInt(req.body.quantity);
  const product_type = req.body.productType;
  const product_img = req.file.filename;
  const path_uploads = "uploads/";
  const fullpath = path_uploads + product_img;
  const add_stock = "INSERT INTO products (productname, unit , price, quantity, product_img,product_type, user_id) VALUES (?, ?, ?, ?, ?, ?,?)";

  con.query(add_stock, [productname, unit, price, quantity, fullpath,product_type, user_id], function (err, result) {
    if (err) {
      console.log(err)
      return res.status(500).send('Error occurred while adding product.');
    }

    res.redirect("/home");
  });
}); 
 
 

//รันที่PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));




