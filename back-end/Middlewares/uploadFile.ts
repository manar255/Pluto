import multer from 'multer'
import fs from 'fs'
// Multer Configuration
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req:any, file:any, cb:any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Unsupported file format!'));
    }
};

if(!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}
const upload = multer({
     storage:storage,
     fileFilter: fileFilter
    });

export default upload; 