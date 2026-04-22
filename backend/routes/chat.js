const express = require('express');
const router = express.Router();
const client = require('../lib/streamChat');

router.post('/token', async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: 'Chat service not configured.' });
  }
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json("userId is required.");
  }
  const token = client.createToken(userId);
  res.status(200).json({ token });
});

module.exports = router;
