const express = require('express');
const con = require('../models/config/database');
const router = express.Router();
const QRcode = require('qrcode');
const generatePayload = require('promptpay-qr');
const bodyparser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');

router.use(bodyparser.json());

router.post('/', function (req, res) {

    /* if(bankacount<=10){    // ทำเงื่อนไขว่าเป็นมือถือ หรือ เป็นเลขบัตร

    }else{

    } */

    const amount = parseFloat(_.get(req.body, "amount"));
    const idcardnumber = '1400700213567';
    const payload = generatePayload(idcardnumber, { amount });
    const option = {
        color: {
            dark: '#000',
            light: '#fff'
        }
    };

    QRcode.toDataURL(payload, option, (err, url) => {
        if (err) {
            return res.status(400).json({
                RespCode: 400,
                respmessage: 'bad ' + err
            });
        } else {
            return res.status(200).json({
                RespCode: 200,
                respmessage: 'good',
                Result: url
            });
        }
    });
});

module.exports = router;