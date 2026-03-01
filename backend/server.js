import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/userAuth.js';
import userRoutes from './routes/userEndpoints.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});