import express from 'express';
import cors from 'cors';
import route from './Routes/route.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Allow only your Azure frontend to access the backend
app.use(cors({
  origin: 'https://thankful-bush-0698e6510.6.azurestaticapps.net',
  credentials: true
}));

app.use(express.json());
app.use('/', route);

const PORT = process.env.PORT || 3000;

// ✅ Use '0.0.0.0' as a string to allow external access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
