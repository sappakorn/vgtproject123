const express = require('express')
const route = express.Router();
const con = require('../models/config/database');

route.get('/', function (req, res) {
    const user_id = req.session.user.user_id;
    const show_history = "SELECT * FROM history_product ORDER BY id DESC LIMIT 1";
    con.query(show_history, function (err, result) {
      if (err) {
        console.error("Error querying database:", err);
        res.render('pages/error', { error: err });
      } else {
        const historyData = result[0]; // ดึงข้อมูลแถวแรกที่ได้จากการ query
        const Date_time = result[0].date_time;
        const sum = result[0].summary;
        const orderData = JSON.parse(result[0].order_data);
        res.render('pages/receipt', {
          orderData: orderData,
          Date_time: Date_time,
          sum: sum,
          historyData:historyData
        });
      }
    });
  
  });

module.exports = route