import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import userAuthRoutes from './routes/userAuth.js';
import joinCompanyRoutes from './routes/joinCompany.js';
import chatRoutes from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

// routes
app.use('/api', userAuthRoutes);
app.use('/api', joinCompanyRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

// specifying port to 3000, local host
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
