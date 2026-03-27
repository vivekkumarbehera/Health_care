const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const observationRoutes = require('./routes/observationRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // creates tables if they don't exist
    console.log('SQLite successfully connected and synchronized via Sequelize.');
  } catch (err) {
    console.error('SQLite connection error:', err);
  }
};

connectDB();

app.use('/auth', authRoutes);
app.use('/api', healthRoutes);
app.use('/api/observations', observationRoutes);

// Serve static files from the React app (build folder)
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
