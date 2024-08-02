const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const moment = require('moment-timezone');
require('moment/locale/th');


router.post('/', function (req, res) {

    const product_id = req.body.product_id;
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productType = req.body.productType;
    const quantity = parseInt(req.body.quantity);
    const trueqtt = quantity - 1;
  
    let count_product = 1;
  
    // สร้าง session Oject สินค้า
    if (!req.session.cartItems) {
      req.session.cartItems = [];
    }
  
    if (req.session.cartItems && Array.isArray(req.session.cartItems)) {
      const findProduct = req.session.cartItems.findIndex(item => item.product_id === product_id)
      if (findProduct !== -1) {
  
  
        const availableQuantity = req.session.cartItems[findProduct].quantity;
  
        // ตรวจสอบว่าเกิน availableQuantity หรือไม่
        if (availableQuantity === 0) {
          // alert แจ้งเตือน 
          console.log("สินค้าไม่เพียงพอ");
          res.redirect('/home');
          return;
        }
        req.session.cartItems[findProduct].count_product += 1;
        req.session.cartItems[findProduct].quantity -= 1;
  
  
      } else {
        req.session.cartItems.push({
          product_id: product_id,
          productName: productName,
          productPrice: productPrice,
          productType: productType,
          count_product: count_product,
          quantity: trueqtt
        });
      }
    }
  
  
    console.log(req.session);
    res.redirect('/home');
  
  
  
  });

module.exports = router;