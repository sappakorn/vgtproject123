const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const bcrypt = require('bcryptjs'); 
const { generateSessionKey } = require('../../app');

router.post('/', async (req, res) => {
  const phone = req.body.phoneNumber;
  const password = req.body.password;

  if (!phone || !password) {
    return res.render('pages/customer_login', { messageerror: "โปรดกรอกข้อมูลให้ครบถ้วน" });
  }

  const sql = "SELECT * FROM customers WHERE phone = ?";
  con.query(sql, [phone], async (err, result) => {
    if (err) {
      return res.status(500).send(err.message); 
    }

    if (result.length > 0) {
      const user = result[0];
      try {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const sessionKey = generateSessionKey();
          req.session.customer = { 
            customer_id : user.customer_id, 
            key : sessionKey,
            customer_name : user.first_name 
          };
          res.setHeader('x-session-key', sessionKey);
          return res.render('pages/customer_home', { message_success : "เข้าสู่ระบบสำเร็จ" });
          

        } else {
          
          return res.render('pages/customer_login', { messageerror: "กรอกรหัสผ่านไม่ถูกต้อง" });
        }
      } catch (error) {
        console.error(error);
        return res.render('pages/customer_login', { messageerror: "การเข้าสู่ระบบล้มเหลว" });
        
      }
    } else {
      return res.render('pages/customer_login', { messageerror: "เข้าสู่ระบบไม่สำเร็จโปรดตรวจสอบหมายเลขโทรศัพท์หรือรหัสผ่าน" });
    }
  });
});

module.exports = router;
