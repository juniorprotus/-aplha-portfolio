require('dotenv').config();
const express = require('express');
const cors = require('cors');
const videoRoutes = require('./routes/videos');
const songRoutes = require('./routes/songs');
const fanRoutes = require('./routes/fans');
const eventRoutes = require('./routes/events');
const merchRoutes = require('./routes/merch');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/fans', fanRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/merch', merchRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Wax Kandle Alpha API is running', version: '1.0.0' });
});

// Export for Vercel
module.exports = app;

// Only listen if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
