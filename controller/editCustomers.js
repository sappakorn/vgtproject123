const express = require('express') //req res redirect 
const router = express.Router()
const con = require('../models/config/database')

router.post('/', function (req, res) {
    
    const id = req.body.customer_id;
    const phone = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const address = req.body.address;
    const bank = req.body.bank;

    //update 
    const sql_customer = `UPDATE customers SET phone = ?, first_name = ?, last_name = ?, address = ?, bank = ?  WHERE customer_id = ?`;
    con.query(sql_customer , [phone, first_name, last_name, address, bank, id], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log('err'+ err + result);
        res.send('success');
      }
    });
})

module.exports = router;
 
