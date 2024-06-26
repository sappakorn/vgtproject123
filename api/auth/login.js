const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const bcrypt = require('bcryptjs'); 
const { generateSessionKey } = require('../../app');

router.post('/', async (req, res) => {

  const phone = req.body.phoneNumber;
  const password = req.body.password;

  if (!phone || !password) {
    
    return res.render('pages/', { messageerror: "โปรดกรอกข้อมูลให้ครบถ้วน" });

  }
  

  const sql = "SELECT * FROM usersprofile WHERE phone = ?";
  con.query(sql, [phone], async (err, result) => {
    if (err) {
      return res.status(500).send(err.message); 
    }

    if (result.length > 0) {
      const user = result[0];
      try {
        /* ใช้ bcrypt เพื่อเปรียบเทียบรหัสผ่านจากฐานข้อมูลที่แปลง */
        const match = await bcrypt.compare(password, user.password);
        if (match) {

          /* สร้างคีย์เพื่อขอดูข้อมูลในหน้าต่างๆ */
          const sessionKey = generateSessionKey();

          req.session.user = { id: user.user_id, key: sessionKey };

          res.setHeader('x-session-key', sessionKey);
          console.log("login success");
          console.log(req.session.user.id);
          return res.render('pages/menu', { messageerror : "เข้าสู่ระบบสำเร็จ" });
         
         
        } else {

          return res.render('pages/', { messageerror: "กรอกรหัสผ่านไม่ถูกต้อง" });

        }
      } catch (error) {
        console.error(error);
        res.status(500).send("การเข้าสู่ระบบล้มเหลว");
      }
    } else {
      res.status(401).send("เข้าสู่ระบบไม่สำเร็จโปรดตรวจสอบหมายเลขโทรศัพท์หรือรหัสผ่าน");
    }
  });
});

module.exports = router;
