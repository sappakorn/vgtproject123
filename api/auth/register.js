const express = require('express');
const router = express.Router();
const con = require("../../config/database");
const argon2 = require('argon2');

router.post('/', async function (req, res, next) {

  const phone_number = req.body.phone_number;
  const password = req.body.password;
  const password2 = req.body.password2;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const location_shop = req.body.location_shop;
  const name_shop = req.body.name_shop;

  if (password !== password2) {
    /* sweet alert *********************** */
    return res.status(400).send("รหัสผ่านไม่ตรงกัน");
  }

  try {

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await argon2.hash(password);
    const sql = "INSERT INTO usersprofile (phone, password,first_name,last_name,location_shop,name_shop) VALUES (?,?,?,?,?,?)";
    con.query(sql, [phone_number, hashedPassword, first_name, last_name, location_shop, name_shop], function (err, result) {

      if (err) {
        /* sweet alert *********************** */
        return res.status(500).send(err.message); // ส่งข้อความ error กลับไปถ้ามีข้อผิดพลาด
      }
      console.log("register success ")
      res.redirect('/');
    });

  } catch (err) {
    console.log("err ", err)
    /* sweet alert *********************** */
    return res.status(500).send("การเข้ารหัสรหัสผ่านล้มเหลว โปรดตรวจสอบรหัสผ่านหรือติดต่อแอดมิน");
  }


});

module.exports = router;