const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imgDir = 'uploads';
const excelDir = 'uploads/excel';

// Ensure upload folders exist
[imgDir, excelDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper function to calculate the next sequence number based on existing files
const getNextSequenceNumber = (directory) => {
    const files = fs.readdirSync(directory);
    let maxNum = 0;

    files.forEach(file => {
        // Extract number from filenames like "1.webp", "2.webp", etc.
        const match = file.match(/^(\d+)\.webp$/i);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
        }
    });

    return maxNum + 1;
};

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
            // Get next sequential number (e.g., if max is 5, next is 6)
            const nextNum = getNextSequenceNumber(imgDir);
            cb(null, `${nextNum}.webp`);
        } else {
            // Standard timestamp naming for Excel files
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'img') {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype.toLowerCase();

        // STRICT: Only allow .webp extension AND image/webp MIME type
        const isWebp = ext === '.webp' && mime === 'image/webp';

        if (isWebp) {
            return cb(null, true);
        }
        return cb(new Error('Strict Validation Failed: Only .webp image files are allowed!'));
    } else if (file.fieldname === 'excel') {
        const allowedTypes = /xlsx|xls|csv/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) return cb(null, true);
        cb(new Error('Only Excel files (.xlsx, .xls, .csv) are allowed!'));
    } else {
        cb(null, true);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;