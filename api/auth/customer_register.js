const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const bcrypt = require('bcryptjs');

router.post('/', async function (req, res, next) {

  const phone = req.body.phone_number;
  const password = req.body.password;
  const password2 = req.body.password2;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;

  // ตรวจสอบข้อมูลครบถ้วนหรือไม่
  if (!phone || !password || !password2 || !first_name || !last_name || !address ) {
    return res.render('pages/customer_register', { messageerror: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });

  }
 // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
  if (password !== password2) {
    return res.render('pages/customer_register', { messageerror: "รหัสผ่านไม่ตรงกัน" });
  }



  try {

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10); 
    const sql = "INSERT INTO customers (phone, password, first_name, last_name,address ) VALUES (?,?,?,?,?)";
    con.query(sql, [phone, hashedPassword, first_name, last_name,  address], function (err, result) {

      if (err) {
        /*  มีหมายเลขนี้แล้ว */
        return res.render('pages/customer_register', { messageerror: "หมายเลขนี้ถูกใช้แล้ว" }); 
      }
      return res.render('pages/customer_login',{ messageerror: "ลงทะเบียนสำเร็จ"});
    });

  } catch (err) {
    console.log("err ", err);
    /* sweet alert สมัครสมาชิก */
    return res.render('pages/customer_register', { messageerror: "มีข้อผิดพลาดในการลงทะเบียน โปรดลองใหม่ภายหลัง" });
  }

});

module.exports = router;
