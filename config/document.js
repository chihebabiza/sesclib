const multer = require('multer');
const path = require('path');

const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/documents/');
    },
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name; 
        const fileExtension = path.extname(file.originalname); 
        cb(null, `${originalName}${fileExtension}`); 
    }
});

const uploadDocument = multer({ storage: documentStorage }).array('documents', 10);

module.exports = uploadDocument;