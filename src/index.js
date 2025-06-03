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

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
