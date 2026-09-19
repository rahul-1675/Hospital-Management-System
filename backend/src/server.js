import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import receptionRoutes from './routes/reception.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import staffRoutes from './routes/staff.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Hospital Management System Backend API',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/reception', receptionRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/feedback', feedbackRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 HMS Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`========================================`);
});
