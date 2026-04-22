const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userAuthRoutes = require('./routes/userAuth');
const userEndpointsRoutes = require('./routes/userEndpoints');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/chat', require('./routes/chat'));

// routes
app.use('/api', userAuthRoutes.default || userAuthRoutes);
app.use('/api', userEndpointsRoutes.default || userEndpointsRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

// specifying port to 3000, local host
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});