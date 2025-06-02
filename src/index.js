import express from 'express';
import cors from 'cors';
import route from './Routes/route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', route);

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



