const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imgDir = 'uploads';
const excelDir = 'uploads/excel';

// Ensure upload folders exist
[imgDir, excelDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'excel') {
            cb(null, excelDir);
        } else {
            cb(null, imgDir);
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'img') {
            // Save as lowercase filename (e.g., "2.webp")
            cb(null, file.originalname.toLowerCase());
        } else {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'img') {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype.toLowerCase();

        // STRICT CHECK 1: Extension must be .webp AND MIME type must be image/webp
        if (ext !== '.webp' || mime !== 'image/webp') {
            return cb(new Error('Strict Validation Failed: Only .webp image files are allowed!'));
        }

        // STRICT CHECK 2: Filename must match the product ID (e.g., 2.webp)
        const productId = req.params?.id;
        if (productId) {
            const expectedFileName = `${productId}.webp`.toLowerCase();
            const actualFileName = file.originalname.toLowerCase();

            if (actualFileName !== expectedFileName) {
                return cb(new Error(`Please rename your image file to "${expectedFileName}" before uploading.`));
            }
        }

        return cb(null, true);
    } else if (file.fieldname === 'excel') {
        const allowedTypes = /xlsx|xls|csv/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) return cb(null, true);
        cb(new Error('Only Excel files (.xlsx, .xls, .csv) are allowed!'));
    } else {
        cb(new Error('Unexpected file field!'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;