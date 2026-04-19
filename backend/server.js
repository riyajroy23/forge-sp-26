const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userAuthRoutes = require('./routes/userAuth');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/chat', require('./routes/chat'));

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