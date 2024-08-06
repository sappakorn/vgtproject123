const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const moment = require('moment-timezone');
require('moment/locale/th');

function getCurrentTime() {
    return moment().tz('Asia/Bangkok').locale('th').format('D MMMM YYYY HH:mm:ss');
}

router.get('/', (req, res) => {
    const productlist = req.session.cart123 || [];
    const count_product = productlist.reduce((total, product) => total + product.quantity, 0);
    
    con.beginTransaction(err => {
        if (err) {
            return res.status(500).send('error database');
        }

        let checkErorr = false;
        let sum = 0;
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
            const quantityToReduce = count_product;
            const totalprice = quantityToReduce * item.productPrice
            sum += totalprice;
            console.log(product_id)
            const checkStock = "select quantity from products where product_id = ? ";
            con.query(checkStock, [product_id], (err, result) => {
                if (err) {
                    checkErorr = true;
                    return con.rollback(() => {
                        res.status(500).send('checkstock failed1');
                    });
                }

                if (result.length === 0) {
                    checkErorr = true;
                    return con.rollback(() => {
                        res.status(404).send('Product not found2');
                    });
                }

                const currentStock = result[0].quantity;
                if (currentStock < quantityToReduce) {
                    checkErorr = true;
                    return con.rollback(() => {
                        res.status(404).send('out of stock3' + product_id);
                    });
                } else {
                    const qtt = currentStock - quantityToReduce;
                    const updateStock = "update products set quantity = ? WHERE product_id = ? ";
                    con.query(updateStock, [qtt, product_id], (err, result) => {
                        if (err) {
                            checkErorr = true;
                            return con.rollback(() => {
                                res.status(500).send('Error updating stock4');
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
                                    console.log("บันทึกลงฐานข้อมูลแล้ว");
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