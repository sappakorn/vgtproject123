const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const moment = require('moment-timezone');
require('moment/locale/th');

function getCurrentTime() {
    return moment().tz('Asia/Bangkok').locale('th').format('D MMMM YYYY HH:mm:ss');
}

router.get('/', (req, res) => {
    const productlist = req.session.currentList;
    const count_product = productlist.reduce((total, product) => total + product.quantity, 0);
    const customer_id = req.session.customer.customer_id;
    const summary = req.session.customer_amount
    console.log(summary)
    con.beginTransaction(err => {
        if (err) {
            return res.status(500).send('error database');
        }

        let checkErorr = false;
        
        const order_data = {
            product_name: [],
            summary: [],
            quantity: [],
            shop_name: [],
            product_id: [],
            product_type: [],
            product_price: []
        }

        productlist.forEach((item, index) => {
            const product_id = item.product_id;
            var quantityToReduce = item.quantity;
            
            console.log(quantityToReduce)
            const checkStock = "select quantity from products where product_id = ? ";
            con.query(checkStock, [product_id], (err, result) => {
                if (err) {
                    checkErorr = true;
                    return con.rollback(() => {
                        console.log("err database  1")
                        
                    });
                }

                if (result.length === 0) {
                    checkErorr = true;
                    return con.rollback(() => {
                        console.log("err database  2")
                    });
                }

                const currentStock = result[0].quantity;

                if (currentStock < quantityToReduce) {
                    checkErorr = true;
                    return con.rollback(() => {
                        console.log('out of stock id = ' + product_id);
                    });
                } else {
                    const qtt = currentStock - quantityToReduce;
                    const updateStock = "update products set quantity = ? WHERE product_id = ? ";
                    con.query(updateStock, [qtt, product_id], (err, result) => {
                        if (err) {
                            checkErorr = true;
                            return con.rollback(() => {
                                console.log("error update 1")
                            });
                        }

                        if (index === productlist.length - 1 && !checkErorr) {
                            con.commit(err => {
                                if (err) {
                                    return con.rollback(() => {
                                        res.status(500).send('Error committing transaction');
                                    });
                                }
                                const currentTime = getCurrentTime();
                                req.session.datetime = currentTime;

                                const st_id = parseInt(item.store_id) ;
                                console.log(st_id)
                                const sql_nameshop = "SELECT name_shop FROM usersprofile WHERE user_id = ?"
                                con.query(sql_nameshop, [st_id], (err, result) => {
                                    if (err) {
                                        return con.rollback(() => {
                                            res.status(500).send('Error fetching shop name 5');
                                        });
                                    }

                                    const shopname = result[0].name_shop;
                                    order_data.shop_name.push(shopname);

                                    productlist.forEach(item=>{
                                        order_data.product_name.push(item.productName)
                                        order_data.quantity.push(item.quantity)
                                        order_data.product_id.push(item.product_id)
                                        order_data.product_type.push(item.productType)
                                        order_data.product_price.push(item.productPrice)
                                    })
                                    const insert_history = "INSERT INTO history_product(user_id, date_time, order_data,summary,customer_id) VALUES (?, ?, ?, ?,?)";
                                    con.query(insert_history, [st_id, currentTime, JSON.stringify(order_data),summary,customer_id], function(err, result2) {
                                        if (err) {
                                            return con.rollback(() => {
                                                console.log(err)
                                                res.status(500).send('Error inserting history');
                                            });
                                        }

                                        
                                        console.log(req.session);
                                        res.redirect('/lineNotify');
                                    });
                                })
                            })
                        }
                    })
                }
            })
        });

    });



});

module.exports = router;