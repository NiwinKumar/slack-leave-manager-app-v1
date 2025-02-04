const { handleViewSubmission } = require('./handlers');

const initializeBot = (app) => {
  app.view('leave_request', handleViewSubmission);

  app.error(async (error) => {
    console.error('An error occurred:', error);
  });

  app.event('app_mention', async ({ event, say }) => {
    await say({
      text: `Hello <@${event.user}>! Use /apply-leave to submit a leave request.`
    });
  });

  app.message(async ({ message, say }) => {
    if (message.channel_type === 'im') {
      await say({
        text: "Hello! Here are the available commands:\n" +
              "• `/apply-leave` - Submit a new leave request\n" +
              "• `/leave-status` - Check your leave requests status"
      });
    }
  });
};

module.exports = { initializeBot };