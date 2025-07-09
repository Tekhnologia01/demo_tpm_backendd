import express from 'express';
import cors from 'cors';
import route from './Routes/route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ Relaxed CORS for development (accepts any origin)
const corsOptions = {
  origin: true, // Accept all origins — safer than '*', supports credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use('/', route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
