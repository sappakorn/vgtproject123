const express = require('express') //req res redirect 
const router = express.Router()
const con = require('../models/config/database')

router.post('/', function (req, res) {
    
    const id = req.body.id;
    const phone = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const location_shop = req.body.location_shop;
    const name_shop = req.body.name_shop;
    const pp_number = req.body.pp_number;

    //update 
    const sql = `UPDATE usersprofile SET phone = ?, first_name = ?, last_name = ?, location_shop = ?, name_shop = ?, pp_number = ? WHERE user_id = ?`;
    con.query(sql, [phone, first_name, last_name, location_shop, name_shop, pp_number, id], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log('err'+ err + result);
        res.send('success');
      }
    });
})

module.exports = router;
 
