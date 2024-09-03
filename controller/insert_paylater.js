const express = require('express')
const con = require('../models/config/database')
const router = express.Router()
const moment = require('moment-timezone');
require('moment/locale/th');
function getCurrentTime() {
    return moment().tz('Asia/Bangkok').locale('th').format('D MMMM YYYY HH:mm:ss');
}

router.post('/', (req, res) => {
    const user_id = req.body.user_id;
    const amount = req.body.amount;
    const customer_name = req.body.customer_name;
    const customer_address = req.body.customer_address;
    const date_time = getCurrentTime();
    const status = "paid";

    sql = ` INSERT INTO 
            paylater( user_id,amount, customers_name, customers_address, due_date, status) 
            VALUES (?,?,?,?,?,?)
          `

    con.query(sql, [user_id, amount, customer_name, customer_address, date_time, status], (error, result) => {
        if (error) {
            req.flash('message_insert_paylater', 'ข้อมูลผิดพลาด');
            res.redirect('/paylater_page');

        } else {
            req.flash('message_insert_paylater', 'เพิ่มรายการจ่ายทีหลังสำเร็จ');
            res.redirect('/paylater_page');

        }
    })

})

module.exports = router;