const express = require('express')
const route = express.Router();
const con = require('../models/config/database');

route.get('/', function (req, res) {
    const customer_id = req.session.customer.customer_id;
    const show_history = "SELECT * FROM history_product where customer_id = ? ORDER BY id DESC LIMIT 1";
    con.query(show_history,[customer_id], function (err, result) {
      if (err) {
        console.error("Error querying database:", err);
        res.render('pages/error', { error: err });
      } else {
        const historyData = result[0]; // ดึงข้อมูลแถวแรกที่ได้จากการ query
        const Date_time = result[0].date_time;
        const sum = result[0].summary;
        const orderData = JSON.parse(result[0].order_data);
        res.render('pages/customer_receipt', {
          orderData: orderData,
          Date_time: Date_time,
          sum: sum
        });
      }
    });
  
  });

module.exports = route