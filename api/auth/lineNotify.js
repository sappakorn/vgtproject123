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
    const customer_phone = req.session.customer.customer_phone //เบอร์ลค.
    const currentList = req.session.currentList //รายการสินค้า 
    const quantity = req.session.quantity //จำนวน
    const productPrice = req.session.productPrice //ราคาต่อชิ้น
    
    console.log("phone"+customer_phone)
    console.log("จำนวน"+quantity)
    console.log("ราคารวม"+customer_amount) 
    console.log("name"+customer_name)
    console.log("ราคาต่อชิ้น"+productPrice)
    console.log(currentList)

    const client = new line.Client(config);
    // const flexMessage = {
    //     type: 'flex',
    //     altText: 'รายการสั่งสินค้า',
    //     contents: {
    //         type: 'bubble',
    //         body: {
    //             type: 'box',
    //             layout: 'vertical',
    //             contents: [
    //                 {
    //                     type: 'text',
    //                     text: 'มีรายการสั่งซื้อสินค้า',
    //                     weight: 'bold',
    //                     color: '#00ff4c',  // สีเขียว
    //                     size: 'lg'
    //                 },
    //                 ...currentList.map((item, index) =>  ({
    //                     type: 'text',
    //                     text: `รายการที่${index+1} ${item.productName} (${item.productType}) จำนวน ${item.quantity} ราคา ${item.productPrice} บาท`,
    //                     wrap: true,
    //                     margin: 'md'
    //                 }))
    //             ]
    //         }
    //     }
    // };
    const flexMessage = {
        type: 'flex',
        altText: 'รายการสั่งสินค้า',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: 'มีรายการสั่งซื้อสินค้า ',
                        weight: 'bold',
                        color: '#00b527',  // สีเขียว
                        size: 'md'
                    },
                    {
                        type: 'text',
                        text: ` คุณ ${customer_name}`, // ชื่อลูกค้า
                        size: 'sm',
                        color: '#888888',
                        margin: 'sm'
                    }
                    ,
                    {
                        type: 'text',
                        text: ` เบอร์โทร ${customer_phone}`, // เบอร์ลูกค้า
                        size: 'sm',
                        color: '#888888',
                        margin: 'sm'
                    },
                    {
                        type: 'separator',
                        margin: 'xl'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'xl',
                        spacing: 'sm',
                        contents: [
                            ...currentList.map((item, index) =>  ({
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    {
                                        type: 'text',
                                        text: `${item.productName}`,
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 1
                                    },
                                    {
                                        type: 'text',
                                        text: `${item.quantity} ${item.productType}`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'center'
                                    },
                                    {
                                        type: 'text',
                                        text: `${item.productPrice} บาท`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'end'
                                    }
                                ]
                            })),
                            {
                                type: 'separator',
                                margin: 'xl'
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    
                                    {
                                        type: 'text',
                                        text: 'รวมเป็นเงิน',
                                        size: 'md',
                                        weight: 'bold',
                                        color: '#555555',
                                        flex: 1
                                    },
                                    {
                                        type: 'text',
                                        text: `${customer_amount} บาท`,
                                        size: 'md',
                                        weight: 'bold',
                                        color: '#111111',
                                        align: 'end'
                                    }
                                ]
                                
                            },
                            {
                                type: 'text',
                                text: 'ชำระเงินแล้ว',
                                size: 'sm',
                                weight: 'bold',
                                color: '#555555',
                                align: 'end'
                            }
                        ]
                    }
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