const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const bcrypt = require('bcryptjs');

router.post('/', async function (req, res, next) {

  const phone_number = req.body.phone_number;
  const password = req.body.password;
  const password2 = req.body.password2;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const location_shop = req.body.location_shop;
  const name_shop = req.body.name_shop;

  // ตรวจสอบข้อมูลครบถ้วนหรือไม่
  if (!phone_number || !password || !password2 || !first_name || !last_name || !location_shop || !name_shop) {
    return res.render('pages/register', { messageerror: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });

  }
 // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
  if (password !== password2) {
    return res.render('pages/register', { messageerror: "รหัสผ่านไม่ตรงกัน" });
  }

  

  try {

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10); 
    const sql = "INSERT INTO usersprofile (phone, password, first_name, last_name, location_shop, name_shop) VALUES (?,?,?,?,?,?)";
    con.query(sql, [phone_number, hashedPassword, first_name, last_name, location_shop, name_shop], function (err, result) {

      if (err) {
        /*  มีหมายเลขนี้แล้ว */
        return res.render('pages/register', { messageerror: "หมายเลขนี้ถูกใช้แล้ว" }); 
      }
      return res.render('pages/index1',{ message_success: "ลงทะเบียนสำเร็จ"});
    });

  } catch (err) {
    console.log("err ", err);
    /* sweet alert สมัครสมาชิก */
    return res.render('pages/register', { messageerror: "มีข้อผิดพลาดในการลงทะเบียน โปรดลองใหม่ภายหลัง" });
  }

});

module.exports = router;
