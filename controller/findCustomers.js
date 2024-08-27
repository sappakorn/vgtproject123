const express = require('express'); //req res redirect 
const router = express.Router()
const con = require('../models/config/database')



router.post('/',(req,res)=>{

    const id = req.body.customer_id //เรียกใช้จาก post จะส่งผ่านbody get/ query

    const sql = "select * from customers where customer_id = ? ";
    con.query(sql,[id], (err,result)=>{

      if(err){
        res.send(err)
      }
      res.render('pages/selectCustomers',{
        dataList : result,
        user_id:id
      })
      
    })
})

module.exports = router;