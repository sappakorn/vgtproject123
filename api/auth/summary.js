const express = require('express');
const router = express.Router();
const con = require("../../models/config/database");
const moment = require('moment');
require('moment/locale/th');

function getCurrentTime() {
    return moment().locale('th').format('D MMMM YYYY HH:mm:ss');
}


router.post('/', (req, res) => {

    const cartItems = req.session.cartItems;
    
    if (!cartItems || cartItems.length === 0) {
        //เช็กว่าตะกร้าสินค้าว่างหรือไม่มีตะกร้า
        console.log("Cart is Empty ")
        return res.render('pages/cart', { messageerror: "กรุณาเลือกสินค้าก่อน" });
    }

    con.beginTransaction(err => {
        if (err) {
            return res.status(500).send('transection เกิดข้อผิดพลาด');
        }

        let errorOccurred = false;

        cartItems.forEach((item, index) => {
            const productId = item.product_id;
            const quantityToReduce = item.count_product;
            console.log(quantityToReduce)
            // ตรวจสอบปริมาณสินค้าที่มีอยู่ในสต็อก
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

                //นำเอาปริมาณสินค้า ปัจจุบันมาเช็คว่า น้อยกว่าจำนวนที่จะลดลงไหม
                const currentStock = results[0].quantity;
                if (currentStock < quantityToReduce) {
                    errorOccurred = true;
                    return con.rollback(() => {
                        res.status(400).send('สินค้าไม่เพียงพอ' + productId);
                    });
                }else{

                    qtt = currentStock - quantityToReduce;
                    const updateStock = "UPDATE products SET quantity = ? WHERE product_id = ?";
                    con.query(updateStock, [qtt, productId], (err, results) => {
                        if (err) {
                            errorOccurred = true;
                            return con.rollback(() => {
                                res.status(500).send('Error updating stock');
                            });
                        }

                        // เมื่ออัปเดตสินค้าทั้งหมดในตะกร้าแล้ว ให้ทำการ Commit การเปลี่ยนแปลง
                        if (index === cartItems.length - 1 && !errorOccurred) {
                            con.commit(err => {
                                if (err) {
                                    return con.rollback(() => {
                                        res.status(500).send('Error committing transaction');
                                    });
                                }

                                /* req.session.cartItems = null */
                                const currentTime = getCurrentTime()
                                req.session.datetime = currentTime;
                                /* 
                                insert history 
                                
                                */
                                req.session.cartItems = null;
                                console.log(req.session)
                                console.log("บันทึกลงฐานข้อมูลแล้ว")
                                return res.render('pages/cart', { message_save: "บันทึกข้อมูลสำเร็จ" });
                                
                            });
                        }
                    });
                }
         
            });
        });
    });
    
});

module.exports = router;
