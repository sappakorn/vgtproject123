const express = require('express')
const router = express.Router();
const con = require('../models/config/database');
const QRcode = require('qrcode');
const generatePayload = require('promptpay-qr');
const bodyparser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');
router.use(bodyparser.json());



router.post('/', function (req, res) {


   const amount = parseFloat(req.body.amount) 
   const user_id = req.session.user.id;
   const myPrompyPay  = "SELECT * FROM usersprofile WHERE user_id = ?";
   con.query(myPrompyPay,[user_id] , (err,result)=>{
      
   if(err){
      console.log('Error Query')
   }else{
      const pp_number = result[0].pp_number;
      const payload = generatePayload(pp_number, {amount});
      const option = {
         color:{
            dark: '#000',
            light: '#fff'
         }
      }
      QRcode.toDataURL(payload,option, (err,url)=>{ //สร้างQRcode เพื่อให้เก็บไว้ใน URL ของมัน และส่ง ให้กับหน้าconfirm_order
         if (err) {
            console.log("send error")
         }else{
            res.render('pages/qrcode_store',{
               result : result,
               qrcodeUrl : url,
               amount:amount
            })  

         }
      })

      
   }
   })
  

});

module.exports = router;