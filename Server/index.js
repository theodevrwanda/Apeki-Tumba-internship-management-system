require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { connectDB } = require('./config/db');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const internshipRoutes = require('./routes/internshipRoutes');

const app = express();

//  Simple Request Logging Middleware for monitoring
app.use((req, res, next) => {
    console.log(`>>> Incoming Request: ${req.method} ${req.originalUrl}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});
// CORS Management
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5175',
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : []),
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, mobile)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// JSON Parsing Support
app.use(express.json());

//  Routing and Endpoint Management
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/internships', internshipRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the TVET Internship Management System API',
        status: 'Running',
        documentation: 'Refer to README.md for server roles and responsibilities'
    });
});

//  Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 30000;

//  Performance and Resource Management (Reuse DB Connection)
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log('📄 Documentation: http://localhost:' + PORT + '/');
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
