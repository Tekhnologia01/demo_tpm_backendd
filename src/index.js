import express from 'express';
import cors from 'cors';
import route from './Routes/route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ Proper CORS setup including preflight support
const allowedOrigins = [
  'https://thankful-bush-0698e6510.6.azurestaticapps.net',
  'http://localhost:3000',
  'http://localhost:7000',
  'http://98.70.58.117:7000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Allow all relevant methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // ✅ Include Authorization header
  credentials: true
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/', route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
