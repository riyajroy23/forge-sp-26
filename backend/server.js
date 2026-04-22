const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userAuthRoutes = require('./routes/userAuth');
const userEndpointsRoutes = require('./routes/userEndpoints');
const browseCompanyRoutes = require('./routes/browseCompanyEndpoints');
const companyMessagesRoutes = require('./routes/companyMessages');
const joinCompanyRoutes = require('./routes/joinCompany');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/chat', require('./routes/chat'));

// routes
app.use('/api', userAuthRoutes);
app.use('/api', userEndpointsRoutes);
app.use('/api', browseCompanyRoutes);
app.use('/api', companyMessagesRoutes);
app.use('/api', joinCompanyRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
