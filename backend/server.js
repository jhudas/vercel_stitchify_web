import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import rentalRoutes from './src/routes/rentalRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/orders', orderRoutes);

const startServer = async () => {
  await connectDB();

  app.get('/', (req, res) => {
    res.json({ message: 'Stitchify API running' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});

