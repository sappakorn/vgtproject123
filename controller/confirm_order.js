const express = require('express')
const router = express.Router();
const con = require('../models/config/database');
const QRcode = require('qrcode');
const generatePayload = require('promptpay-qr');
const bodyparser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');
router.use(bodyparser.json());



router.get('/', function (req, res) {
   const productlist = req.session.cart123 || [];
   const count_product = productlist.reduce((total, product) => total + product.quantity, 0);
   const store_id = productlist[0].store_id;
   var sum = 0;
   productlist.forEach((item, index)=>{
      sum +=  item.quantity*item.productPrice
   })
   
   const amount  = parseFloat(sum)
   console.log(typeof(amount));
   
   const myPrompyPay  = "SELECT pp_number FROM usersprofile WHERE user_id = ?";
   con.query(myPrompyPay,[store_id] , (err,result)=>{
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
               res.render('pages/confirm_order',{
                  productlist:productlist,
                  count_product:count_product,
                  qrcodeUrl : url
               })  

            }
         })

         
      }
   })
  

});

module.exports = router;