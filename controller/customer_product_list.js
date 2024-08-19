const express = require('express')
const route = express.Router();
const con = require('../models/config/database');


route.post('/', function (req, res) {

  const store_id = req.body.store_id;
  req.session.customer.customer_store_id = store_id;
  const customer_store_id = req.session.customer.customer_store_id;

  console.log("you Select store_ID :" + customer_store_id + "") //ใช้ store_id เพื่อที่จะได้รู้ว่าลูกค้าเลือกร้านไหน จะได้รู้ ว่าเราเลือกร้านไหน  

  const selectProduct = `SELECT * FROM products WHERE user_id = ?  ORDER BY productname ASC `;
  req.session.status = 0;
  con.query(selectProduct, [customer_store_id], function (err, productResult) {
    if (err) throw err;
    const selectProductType = "SELECT DISTINCT product_type  FROM products WHERE user_id = ? ";
    con.query(selectProductType, [customer_store_id], function (err, typeResult) {
      if (err) throw err;
      res.render('pages/customer_product_list', { 
        product_list: productResult, 
        type_list: typeResult, 
        store_id: req.session.customer.customer_store_id 
      });
    });
  });
});
module.exports = route;