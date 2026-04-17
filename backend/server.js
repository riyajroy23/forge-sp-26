import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userAuthRoutes from './routes/userAuth.js';
import browseCompanyRoutes from './routes/browseCompanyEndpoints.js';
import joinCompanyRoutes from './routes/joinCompany.js';
import companyMessagesRoutes from './routes/companyMessages.js';

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api', userAuthRoutes);
app.use('/api', browseCompanyRoutes);
app.use('/api', joinCompanyRoutes);
app.use('/api', companyMessagesRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
