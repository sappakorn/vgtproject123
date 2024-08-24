const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

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
    let filePath;
    try {
         filePath = req.file.path;
        console.log('File Path:', filePath); // ตรวจสอบเส้นทางไฟล์ที่ถูกบันทึก

        const formData = new FormData();
        formData.append('files', fs.createReadStream(filePath));

        const response = await axios.post('https://api.slipok.com/api/line/apikey/26331', formData, {
            headers: {
                'x-authorization': 'SLIPOK38ZLUD1',
                ...formData.getHeaders()
            }
        });

        if (response.status === 200) {
            res.json(response.data);
        } else {
            throw new Error('Failed to send a request');
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
        // จัดการข้อผิดพลาดและส่งข้อความตอบกลับไปยัง client
        res.status(500).json({ error: error.message });
    } finally {
        // ลบไฟล์ชั่วคราวหลังจากส่งข้อมูลเสร็จสิ้น
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete file:', err);
            else console.log('Temporary file deleted successfully');
        });
    }
    
});
module.exports = router; 


