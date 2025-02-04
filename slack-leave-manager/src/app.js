const { App } = require('@slack/bolt');
const { config } = require('../config/config');
const mongoose = require('mongoose');
const { initializeBot } = require('./bot');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

app.error(async (error) => {
  console.error('Global app error:', error);
});

const { registerLeaveCommand } = require('./commands/request');
const { registerApprovalCommand } = require('./commands/approve');

registerLeaveCommand(app);
registerApprovalCommand(app);

initializeBot(app);

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();