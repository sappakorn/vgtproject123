const express = require('express');
const router = express.Router();
const app = express();
require('dotenv').config();
const line = require('@line/bot-sdk');
const util = require('util');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { type } = require('os');
const { count } = require('console');
app.use(express.static(path.join(__dirname, 'download')));

const config = {
    channelAccessToken: process.env.token,
    channelSecret: process.env.secretcode
}

router.get('/', (req, res) =>  {
    
    const customer_amount = req.session.customer_amount //ยอดรวม
    const customer_name = req.session.customer.customer_name //ชื่อลค.
    const customer_phone = req.session.customer.customer_phone //ชื่อลค.
    const currentList = req.session.currentList //รายการสินค้า 
    
    console.log("phone"+customer_phone)
    console.log("ราคารวม"+customer_amount) 
    console.log("name"+customer_name)
    console.log(currentList)

    const client = new line.Client(config);
    const flexMessage = {
        type: 'flex',
        altText: 'มีรายการสินใหม่เข้า',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: 'มีรายการสินใหม่เข้า',
                        weight: 'bold',
                        color: '#00ff4c',  // สีเขียว
                        size: 'lg'
                    },
                    ...currentList.map((item, index) =>  ({
                        type: 'text',
                        text: `รายการที่${index+1} ${item.productName} (${item.productType}) จำนวน ${item.quantity} ราคา ${item.productPrice} บาท`,
                        wrap: true,
                        margin: 'md'
                    }))
                ]
            }
        }
    };

    client.pushMessage("U804c8bd86015d82202138ecbb668f531", flexMessage)
        .then(() => {
            console.log('Message sent');
            res.redirect('/customer_home') 
        })
        .catch((err) => {
            console.error(err);
    });
    
    
    
    

})


app.get('/webhook', line.middleware(config), (req, res) => {

    
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });

        
        console.log(req.session)
        
});










module.exports = router;
