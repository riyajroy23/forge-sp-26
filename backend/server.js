const express = require('express');
const cors = require('cors');
require('dotenv').config();

app.use('/api', userAuthRoutes);

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// specifying port to 3000, local host
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});