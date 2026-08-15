import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
import { setupSocketHandlers } from './sockets/socketManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/sos', sosRoutes);

// Base Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'YatriRaksha Fleet Gateway API', timestamp: new Date() });
});

// Serve static React frontend if dist exists
const clientDistPath = path.join(__dirname, '../../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Socket.IO Handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`[YatriRaksha Server] Running on http://localhost:${PORT}`);
});
