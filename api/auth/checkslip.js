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
    try {
        const filePath = req.file.path;
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
            console.log('Request successful');
            res.json(response.data);
        } else {
            throw new Error('Failed to send a request');
        }
    } catch (error) {
        console.log('Error during fetching data:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
module.exports = router; 


