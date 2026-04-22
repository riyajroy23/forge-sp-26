const { StreamChat } = require('stream-chat');

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

let client = null;

if (apiKey && apiSecret) {
  client = StreamChat.getInstance(apiKey, apiSecret);
} else {
  console.warn('Warning: STREAM_API_KEY or STREAM_API_SECRET not set. Chat features disabled.');
}

module.exports = client;
