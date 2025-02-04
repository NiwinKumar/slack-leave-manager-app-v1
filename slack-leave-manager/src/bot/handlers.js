const Leave = require('../db/models/leave');
const { formatDate, calculateDuration } = require('../utils/date');
const { createLeaveRequestMessage } = require('../utils/messages');

const handleViewSubmission = async ({ ack, body, view, client }) => {
  try {
    console.log('View submission received:', {
      userId: body.user.id,
      viewId: view.id,
      callbackId: view.callback_id
    });

    await ack();

    const userId = body.user.id;
    const values = view.state.values;
    
    const leaveRequest = {
      userId,
      startDate: values.date_start.start_date.selected_date,
      endDate: values.date_end.end_date.selected_date,
      type: values.leave_type.type.selected_option.value,
      managerId: values.manager_select.manager.selected_option.value,
      notes: values.notes?.note_text?.value || '',
      status: 'pending'
    };

    console.log('Creating leave request:', leaveRequest);
    const leave = await Leave.create(leaveRequest);
    console.log('Leave request created:', leave);

    const requesterInfo = await client.users.info({ user: userId });
    const managerInfo = await client.users.info({ user: leaveRequest.managerId });

    if (!requesterInfo.ok || !managerInfo.ok) {
      throw new Error('Could not fetch user information from Slack');
    }

    await client.chat.postMessage({
      channel: leaveRequest.managerId,
      text: `New leave request from <@${userId}>`,
      blocks: createLeaveRequestMessage(leave, userId, {
        fullName: requesterInfo.user.real_name || requesterInfo.user.name
      }).blocks
    });

    await client.chat.postMessage({
      channel: userId,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "✅ Leave Request Submitted",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Your leave request has been submitted to *${managerInfo.user.real_name || managerInfo.user.name}*. You'll be notified once it's reviewed.`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Type:*\n${leaveRequest.type.charAt(0).toUpperCase() + leaveRequest.type.slice(1)}`
            },
            {
              type: "mrkdwn",
              text: `*Duration:*\n${calculateDuration(leaveRequest.startDate, leaveRequest.endDate)} day(s)`
            },
            {
              type: "mrkdwn",
              text: `*From:*\n${formatDate(leaveRequest.startDate)}`
            },
            {
              type: "mrkdwn",
              text: `*To:*\n${formatDate(leaveRequest.endDate)}`
            }
          ]
        }
      ]
    });

  } catch (error) {
    console.error('Error in view submission:', error);
    try {
      await client.chat.postMessage({
        channel: body.user.id,
        text: "❌ There was an error submitting your leave request. Please try again."
      });
    } catch (notifyError) {
      console.error('Error sending error notification:', notifyError);
    }
  }
};

module.exports = { handleViewSubmission };