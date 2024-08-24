const express = require('express')
const router = express.Router();
const con = require('../../models/config/database');

router.get('/', (req, res) => {
    //ฝั่งร้านค้า
    const receiverName = 'สรรพกร แ'
    const fisrtName = 'สรรพกร'
    const lastName = 'แก่นนาคำ'

    const nameSplit = receiverName.split(' ')
    const receiverFName = nameSplit[0]
    const receiverLName = nameSplit[1]
    const isFisrtNameMath = receiverFName === fisrtName;
    const idLastNameMath = receiverLName === lastName.charAt(0);
    
    
    if(isFisrtNameMath && idLastNameMath){
        console.log(receiverFName)
        console.log(receiverLName)
        console.log('receiverMath')
    }
    //

    //ฝั่งลูกค้า
    const senderName = 'ดาราทอง ล'
    const customer_fname  = 'ดาราทอง'
    const customer_lname = 'ลุนบง'

    const customersplit = senderName.split(' ')
    const senderFName = customersplit[0]
    const senderLName = customersplit[1]
    const isCustomerNameMath = senderFName === customer_fname;
    const isCustomerLNameMath = senderLName === customer_lname.charAt(0)

    if(isCustomerNameMath && isCustomerLNameMath){
        console.log(senderFName)
        console.log(senderLName)
        console.log('senderMath')
    }
    //


    res.send('Math = 2')

})

module.exports = router;