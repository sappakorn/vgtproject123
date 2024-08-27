const express = require('express'); //req res redirect 
const router = express.Router()
const con = require('../models/config/database')



router.post('/',(req,res)=>{

    const id = req.body.user_id //เรียกใช้จาก post จะส่งผ่านbody get/ query

    const sql_customer = "select * from customers where user_id = ? ";
    con.query(sql_customer,[id], (err,result)=>{

      if(err){
        res.send(err)
      }
      res.render('pages/selectAdmin',{
        dataList : result,
        user_id:id
      })
      
    })
})

module.exports = router;