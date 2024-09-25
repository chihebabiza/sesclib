const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const uploadImage = multer({ storage: imageStorage });

module.exports = uploadImage;