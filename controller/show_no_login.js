const express = require('express');
const router = express.Router();
const con = require('../models/config/database'); // ปรับแก้การ import

router.post('/', function (req, res) {
  console.log("Hello Guest");
  const store_id = req.body.store_id;
  const show_product_nologin = "SELECT * FROM products WHERE user_id = ?";
  con.query(show_product_nologin, [store_id], function (err, result) {
    if (err) {
      console.log(err + " error show_no_login");
      return res.status(500).send("Database query error");
    }
    res.render('pages/show_product_nologin', { 
      result: result ,
    }); 
  });
});
module.exports = router;
