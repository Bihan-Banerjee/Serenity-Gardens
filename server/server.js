const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/auth');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON body

app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Routes
app.use('/api/auth', authRoutes);

// Catch All 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
