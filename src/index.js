import express from 'express';
import cors from 'cors';
import route from './Routes/route.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Allow only your Azure frontend to access the backend
app.use(cors({
  origin: 'https://thankful-bush-0698e6510.6.azurestaticapps.net',
  origin: function (origin, callback) {
  const allowedOrigins = [
    'https://thankful-bush-0698e6510.6.azurestaticapps.net',
    'http://localhost:3000',
    'http://localhost:7000',
    'http://98.70.58.117:7000'
  ];
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}

  credentials: true
}));

app.use(express.json());
app.use('/', route);

const PORT = process.env.PORT || 3000;

// ✅ Use '0.0.0.0' as a string to allow external access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
