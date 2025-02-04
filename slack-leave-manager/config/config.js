// config/config.js
require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.DATABASE_URL
  },
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN
  }
};

module.exports = { config };