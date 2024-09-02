const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const moment = require('moment-timezone');
require('moment/locale/th');

function getCurrentTime() {
    return moment().tz('Asia/Bangkok').locale('th').format('D MMMM YYYY HH:mm:ss');
}

router.post('/', (req, res) => {
    const cartItems = req.session.cartItems;

    if (!cartItems || cartItems.length === 0) {
        console.log("Cart is Empty ");
        return res.render('pages/cart', { messageerror: "กรุณาเลือกสินค้าก่อน" });
    }

    con.beginTransaction(err => {
        if (err) {
            return res.status(500).send('transection เกิดข้อผิดพลาด');
        }

        let errorOccurred = false;
        let sum = 0;
        const orderData = {
            product_name: [],
            summary: [],
            quantity: [],
            shop_name: [],
            product_id: [],
            product_type: [],
            product_price:[]
        };

        cartItems.forEach((item, index) => {
            const productId = item.product_id;
            const quantityToReduce = item.count_product;
            const totalprice = quantityToReduce * item.productPrice;
            sum += totalprice;

            const checkStockSql = "SELECT quantity FROM products WHERE product_id = ?";
            con.query(checkStockSql, [productId], (err, results) => {
                if (err) {
                    errorOccurred = true;
                    return con.rollback(() => {
                        res.status(500).send('เกิดข้อผิดพลาดในการเช็คสต็อก');
                    });
                }

                if (results.length === 0) {
                    errorOccurred = true;
                    return con.rollback(() => {
                        res.status(404).send('Product not found');
                    });
                }

                const currentStock = results[0].quantity;
                if (currentStock < quantityToReduce) {
                    errorOccurred = true;
                    return con.rollback(() => {
                        res.status(400).send('สินค้าไม่เพียงพอ' + productId);
                    });
                } else {
                    const qtt = currentStock - quantityToReduce;
                    const updateStock = "UPDATE products SET quantity = ? WHERE product_id = ?";
                    con.query(updateStock, [qtt, productId], (err, results) => {
                        if (err) {
                            errorOccurred = true;
                            return con.rollback(() => {
                                res.status(500).send('Error updating stock');
                            });
                        }

                        if (index === cartItems.length - 1 && !errorOccurred) {
                            con.commit(err => {
                                if (err) {
                                    return con.rollback(() => {
                                        res.status(500).send('Error committing transaction');
                                    });
                                }

                                const currentTime = getCurrentTime();
                                console.log(currentTime);
                                req.session.datetime = currentTime;

                                const user_idd = parseInt(req.session.user.user_id);
                                const qr_nameshop = "SELECT name_shop FROM usersprofile WHERE user_id = ?";
                                con.query(qr_nameshop, [user_idd], function(err, reslt) {
                                    if (err) {
                                        return con.rollback(() => {
                                            res.status(500).send('Error fetching shop name');
                                        });
                                    }
                                    
                                    const shop_name = reslt[0].name_shop;
                                    orderData.shop_name.push(shop_name);
                                    
                                    cartItems.forEach(item => {
                                        orderData.product_name.push(item.productName);
                                        orderData.quantity.push(item.count_product);
                                        orderData.product_id.push(item.product_id);
                                        orderData.product_type.push(item.productType);
                                        orderData.product_price.push(item.productPrice)
                                    });

                                    const insert_history = "INSERT INTO history_product(user_id, date_time, order_data,summary) VALUES (?, ?, ?, ?)";
                                    con.query(insert_history, [user_idd, currentTime, JSON.stringify(orderData),sum], function(err, result2) {
                                        if (err) {
                                            return con.rollback(() => {
                                                res.status(500).send('Error inserting history');
                                            });
                                        }

                                        req.session.cartItems = null;
                                        console.log(sum);
                                        console.log(req.session);
                                        console.log("บันทึกลงฐานข้อมูลแล้ว");
                                        res.redirect('/receipt');
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    });
});

module.exports = router;
