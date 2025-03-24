import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

// Configure dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Simplified CORS - allows all origins
app.use(express.json());

// Add a test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment variables loaded:', {
        port: process.env.PORT,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
}); 