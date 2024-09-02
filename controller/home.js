const express = require('express')
const route = express.Router();
const con = require('../models/config/database');

route.get('/', function (req,res){
    const id = req.session.user.user_id
    const selectProduct = `SELECT * FROM products WHERE user_id = ?  ORDER BY productname ASC `;
  
    con.query(selectProduct, [id], function (err, productResult) {
      if (err) throw err;
      const selectProductType = "SELECT DISTINCT product_type  FROM products WHERE user_id = ? ";
      con.query(selectProductType, [id], function (err, typeResult) {
        if (err) throw err;
        res.render('pages/home', { product_list: productResult, type_list: typeResult });
      });
    });
})

module.exports = route;
