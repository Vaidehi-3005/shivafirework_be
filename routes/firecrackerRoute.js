const express = require('express');
const router = express.Router();
const controller = require('../controllers/firecrackerController');
const upload = require('../middleware/upload');
const auth = require('../middleware/authMiddleware'); // Path to your auth middleware

// --- PUBLIC ROUTES ---
// Anyone can view firecrackers
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// --- PROTECTED ROUTES (Requires Superadmin Token) ---
// Pass auth middleware before upload/controller handlers

router.post('/', auth, controller.createSingle);

// Excel Bulk Upload
router.post('/upload-excel', auth, upload.single('excel'), controller.bulkUploadExcel);

// Update and Delete
router.put('/:id', auth, upload.single('img'), controller.update);
router.delete('/:id', auth, controller.deleteItem); 

module.exports = router;