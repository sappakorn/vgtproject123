const express = require('express');
const app = express()
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const moment = require('moment');
const con = require('../../models/config/database');
const { result } = require('lodash');
const cors = require('cors')

app.use(cors())

function getBankCode(bankName) {
    let bankCode;
    switch (bankName) {
        case 'BBL':
            bankCode = '002';
            break;
        case 'KBANK':
            bankCode = '004';
            break;
        case 'KTB':
            bankCode = '006';
            break;
        case 'TTB':
            bankCode = '011';
            break;
        case 'SCB':
            bankCode = '014';
            break;
        case 'BAY':
            bankCode = '025';
            break;
        case 'KKP':
            bankCode = '069';
            break;
        case 'CIMBT':
            bankCode = '022';
            break;
        case 'TISCO':
            bankCode = '067';
            break;
        case 'UOBT':
            bankCode = '024';
            break;
        case 'TCD':
            bankCode = '071';
            break;
        case 'LHFG':
            bankCode = '073';
            break;
        case 'ICBCT':
            bankCode = '070';
            break;
        case 'SME':
            bankCode = '098';
            break;
        case 'BAAC':
            bankCode = '034';
            break;
        case 'EXIM':
            bankCode = '035';
            break;
        case 'GSB':
            bankCode = '030';
            break;
        case 'GHB':
            bankCode = '033';
            break;
        default:
            bankCode = 'Unknown';
            break;
    }
    return bankCode;
}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/slips';
        fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {

    const totalPrice = req.session.customer_amount
    console.log('total = '+totalPrice) //ยังไม่ลบ session จนกว่าจำชำระเงินเสร็จ


  
    let filePath;
      try { 
        filePath = req.file.path;

        console.log('File Path:', filePath); // ตรวจสอบเส้นทางไฟล์ที่ถูกบันทึก

        const formData = new FormData();

        formData.append('files', fs.createReadStream(filePath));
        //formData.append('log', 'true')  ทำในกรณีใช้แค่ร้านเดียว error.response?.data.message จะได้ 400 และ response error
   
        response = await axios.post('https://api.slipok.com/api/line/apikey/26331', formData, {
            headers: {
                'x-authorization': 'SLIPOK38ZLUD1',
                ...formData.getHeaders(),
           
            }
        })
        
        
        if (response.status === 200) {
            const transRef = response.data.data.transRef

            const checkQuery = "SELECT COUNT(*) AS count FROM slipref WHERE tranRef = ?";
            con.query(checkQuery, [transRef], (err, result) => {
                if (err) {
                    console.error("เกิดข้อผิดพลาดในการตรวจสอบ slip reference:", err);
                    return;
                }

                if (result[0].count > 0) {
                    res.send("พบสลิปซ้ำ"+transRef);
                    return
                } else {
                    const insertQuery = "INSERT INTO slipref(tranRef) VALUES(?)";
                    con.query(insertQuery, [transRef], (err, result) => {
                        if (err) {
                            console.error("เกิดข้อผิดพลาดในการแทรก slip reference:", err);
                        } else {
                            console.log("แทรก slip reference สำเร็จ.");
                            if (response.data.success === true) {
                                // ข้อมูลเวลาที่ได้รับ
                                const transDate = response.data.data.transDate // วันที่ที่ถูกต้อง
                                const transTime = response.data.data.transTime // เวลา 
                                const transactionMoment = moment(`${transDate}T${transTime}`, 'YYYYMMDDTHH:mm:ss').tz('Asia/Bangkok'); // เวลาที่ทำธุรกรรมตามขอบเขตเวลาของ กรุงเทพ
                                const currentMoment = moment().tz('Asia/Bangkok');
                                const timeDifference = currentMoment.diff(transactionMoment, 'minutes');
                                console.log('Time Difference (in minutes):', timeDifference);
                                if (timeDifference <= 5) {
                                    console.log('ทำธุรกรรมในเวลา');//ทำรายการในเวลาที่กำหนด
                                    const customer_id = req.session.customer.customer_id;
                                    const store_id = req.session.customer.customer_store_id;
                                    //ตรวจสอบธนาคารและชื่อที่โอน ต้องตรงกับเลขบัญชีที่สมัคร 
                                    const amount = response.data.data.amount //จำนวนเงินจากการ Api
                                    const senderName = response.data.data.sender.displayName // ชื่อจาก APi เช่น นาย สรรพกร แ
                                    const nameSplit = senderName.split(' ') //แยกชื่อออกจากนามสกุลด้วยช่องว่าง
                                    const senderFName = nameSplit[1] //ชื่อจริง
                                    const senderLName = nameSplit[2] //นามสกุล
                                    const receiver = response.data.data.receiver.displayName
                                    const userNameSplit = receiver.split(' ');
                                    const receiverFName = userNameSplit[1]
                                    const receiverLName = userNameSplit[2]
                                    const sql = "select * from customers where customer_id = ?";
                                    con.query(sql, [customer_id], (err, result) => {
                                        if (err) {
                                            res.send('เกิดข้อผิดพลาดฐานข้อมูล หรือ ค้นหาผู้ใช้งานไม่ได้' + err)
                                        }
                                        const customer0 = result[0]
                                        const customer_fname = customer0.first_name
                                        const customer_lname = customer0.last_name
                                        console.log(customer_fname)
                                        console.log(customer_lname)
                                        const bankName = customer0.bank;

                                        const bankCode = getBankCode(bankName) //เปรียนชื่อธนาคาร จากฐานข้อมูลให้เป็น รหัสธนาคาร เพื่อเปรียบกับ Api 
                                        const isBankMath = bankCode === response.data.data.sendingBank //เปรียบเทียบ แบงค์ ผู้โอนในระบบ และ apiตอบกลับมา
                                        const isamountMath = totalPrice === amount; // ตรวจสอบ ราคา ที่โอน และ ที่ apiตอบกลับมา 
                                        console.log("totalprice from session"+totalPrice)
                                        console.log("amount from API "+amount)
                                        const isCustomerNameMath = senderFName === customer_fname; // ตรวจสอบชื่อในระบบ ว่าตรงกับ Apiตอบกลับมาไหม
                                        const isCustomerLNameMath = senderLName === customer_lname.charAt(0) // ตรวจสอบนามสกุลในระบบตัวแรก ว่าตรงกับ Apiตอบกลับมาไหม

                                        if (isCustomerNameMath && isCustomerLNameMath && isamountMath && isBankMath) {
                                            const sqluser = "select * from usersprofile where user_id = ?";
                                            con.query(sqluser, [store_id], (err, result) => {
                                                if (err) { res.send('เกิดข้อผิดพลาดในการดึงข้อมูล ร้านค้า') }

                                                const user = result[0]
                                                const user_fname = user.first_name;
                                                const user_lname = user.last_name;
                                                const isUserFnameMath = receiverFName === user_fname;
                                                const isUserLnameMath = receiverLName === user_lname.charAt(0);

                                                if (isUserFnameMath && isUserLnameMath) {

                                                    fs.unlink(filePath, (err) => {
                                                        if (err) console.error('Failed to delete file:', err);
                                                        else console.log('ลบไฟล์slip');
                                                    });

                                                    console.log("userFName : " + isUserFnameMath)
                                                    console.log("userLname : " + isUserLnameMath)
                                                    console.log("customerName : " + isCustomerNameMath)
                                                    console.log("customerLName : " + isCustomerLNameMath)
                                                    console.log("ราคา : " + isamountMath)
                                                    console.log("BankCode : " + isBankMath)
                                                    console.log("SlipOk")

                                                    res.redirect('/customer_checkout')

                                                } else {
                                                    console.log("userFName : " + isUserFnameMath)
                                                    console.log("userLname : " + isUserLnameMath)
                                                    console.log(req.session.currentList.productlist)
                                                    res.send('โอนไม่ตรงกับบัญชีร้าน')
                                                }

                                            })

                                        } else {
                                            console.log("cusName : " + isCustomerNameMath)
                                            console.log("cusLastName : " + isCustomerLNameMath)
                                            console.log("amount : " + isamountMath)
                                            console.log("BankName : " + isBankMath)
                                            res.send("isCustomerNameMath && isCustomerLNameMath && isamountMath && isBankMath   NOT math !! ")
                                        }
                                    })


                                } else {
                                    res.send('ทำธุรกรรมเกินเวลาที่กำหนดไป');
                                }

                            } else {
                                console.log('error ตรง success')
                            }
                        }
                    });
                }
            });

        } else {
            throw new Error('Failed to send a request');
        } 
      } catch (error) {
        res.send(error);
    } finally {
        // ลบไฟล์ชั่วคราวหลังจากส่งข้อมูลเสร็จสิ้น
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete file:', err);
            else console.log('Temporary file deleted successfully');
        });
    }  

});
module.exports = router;


