const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Your provided Multer file

// Authentication Routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify-auth', authenticateToken, authController.verifyAuth);

// File Upload Route (Uses your uploaded file config)
router.post('/upload', authenticateToken, upload.fields([{ name: 'img' }, { name: 'excel' }]), (req, res) => {
  res.json({ success: true, files: req.files });
});

module.exports = router;