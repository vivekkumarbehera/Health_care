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

const User = require('./models/User');

let dbInitialized = false;
const connectDB = async () => {
  if (dbInitialized) return;
  try {
    await sequelize.sync({ alter: true });
    console.log('SQLite successfully connected and synchronized via Sequelize.');
    
    // Auto-seed a default user for demonstration purposes (especially for Vercel)
    const count = await User.count();
    if (count === 0) {
      await User.create({
        email: 'admin@health.com',
        password: 'password123',
        role: 'Care Manager'
      });
      console.log('Seeded default demo user: admin@health.com / password123');
    }
    dbInitialized = true;
  } catch (err) {
    console.error('SQLite connection or seeding error:', err);
  }
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  console.log(`Incoming request: ${req.method} ${req.url} (Original: ${req.originalUrl})`);
  next();
});

app.get('/api/ping', (req, res) => {
  res.json({ 
    message: 'pong', 
    time: new Date().toISOString(), 
    url: req.url,
    originalUrl: req.originalUrl,
    dbInitialized 
  });
});

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

// Only run the server locally, Vercel will handle this as a serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
