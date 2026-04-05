const { StreamChat } = require('stream-chat');

const client = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

module.exports = client;
