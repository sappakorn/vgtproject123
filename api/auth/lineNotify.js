const express = require('express');
const router = express.Router();
const app = express();
require('dotenv').config();
const line = require('@line/bot-sdk');
const con = require('../../models/config/database')

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
}

app.get('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all([
            req.body.events.map(handleEvents())
        ])
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
    console.log(req.session)

});

const client = new line.Client(config);
function handleEvents(event) {

    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    if (event.type === 'follow' || event.type === 'message') {
        const userId = event.source.userId;
        console.log('User ID:', userId);
        sql = "insert into usersprofile (?) "
    }
    console.log(events)
}


router.get('/', (req, res) => {
    const customer_amount = req.session.customer_amount //ยอดรวม
    const customer_name = req.session.customer.customer_name //ชื่อลค.
    const customer_phone = req.session.customer.customer_phone //เบอร์ลค.
    const currentList = req.session.currentList //รายการสินค้า 
  
    const client = new line.Client(config);
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
                            ...currentList.map((item, index) => ({
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
    const store_id = req.session.customer.customer_store_id;
    const sql = "select line_id from usersprofile where user_id = ? ";
    con.query(sql, [store_id], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Server error');
            return;
        }

        if(result.length > 0){
            
            const line_id = result[0].line_id
            console.log(line_id)
            client.pushMessage(line_id, flexMessage)
                .then(() => {
                    console.log('Message sent' );
                    res.redirect('/customer_home')
                })
                .catch((err) => {
                    console.error(err);
                });
        }else{
            res.redirect('/customer_home')
        } 
    })
})



module.exports = router;


