require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const cookieParser = require('cookie-parser');

// Import routes
const firecrackerRoutes = require('./routes/firecrackerRoute');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 Debug Middleware: Log incoming auth token before routes handle it
app.use('/api/firecrackers', (req, res, next) => {
    console.log('--- [SERVER.JS] INCOMING REQUEST ---');
    console.log('Method:', req.method);
    console.log('Headers Auth:', req.headers.authorization);
    console.log('Query Token:', req.query.token);
    console.log('Cookies:', req.cookies);
    next();
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/firecrackers', firecrackerRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
});