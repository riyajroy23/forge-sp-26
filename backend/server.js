import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userAuthRoutes from './routes/userAuth.js';

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api', userAuthRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

// specifying port to 3000, local host
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});