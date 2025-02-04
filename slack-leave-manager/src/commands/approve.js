const Leave = require('../db/models/leave');
const User = require('../db/models/user');
const { formatDate, calculateDuration } = require('../utils/date');

const registerApprovalCommand = (app) => {
  app.action('approve_leave', async ({ ack, body, client }) => {
    try {
      await ack();
      console.log('Approval action received:', body.actions[0].value);
      
      const leaveId = body.actions[0].value;
      const approverNote = body.state?.values?.approver_note?.note_input?.value;
      
      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        {
          status: 'approved',
          approverId: body.user.id,
          approverNote: approverNote || "Request approved"
        },
        { new: true }
      );

      if (!leave) {
        throw new Error('Leave request not found');
      }

      const approverInfo = await client.users.info({ user: body.user.id });
      
      await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "✅ Leave Request Approved",
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Leave request from <@${leave.userId}> has been *approved* by <@${body.user.id}>`
            }
          }
        ]
      });

      await client.chat.postMessage({
        channel: leave.userId,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "✅ Leave Request Approved",
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Your leave request has been approved by *${approverInfo.user.real_name}*`
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Type:*\n${leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}`
              },
              {
                type: "mrkdwn",
                text: `*Duration:*\n${calculateDuration(leave.startDate, leave.endDate)} day(s)`
              },
              {
                type: "mrkdwn",
                text: `*From:*\n${formatDate(leave.startDate)}`
              },
              {
                type: "mrkdwn",
                text: `*To:*\n${formatDate(leave.endDate)}`
              }
            ]
          },
          approverNote ? {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Note from Approver:*\n${approverNote}`
            }
          } : null
        ].filter(Boolean)
      });
      
      console.log('Leave request approved and notifications sent');

    } catch (error) {
      console.error('Error in approve action:', error);
    }
  });

  app.action('reject_leave', async ({ ack, body, client }) => {
    await ack();
    
    try {
      const leaveId = body.actions[0].value;
      const approverNote = body.state?.values?.approver_note?.note_input?.value;
      
      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        {
          status: 'rejected',
          approverId: body.user.id,
          approverNote: approverNote || "Request rejected"
        },
        { new: true }
      );

      if (!leave) {
        throw new Error('Leave request not found');
      }

      // Get approver info from Slack
      const approverInfo = await client.users.info({ user: body.user.id });

      if (!approverInfo.ok) {
        throw new Error('Could not fetch approver information');
      }

      // Update original message
      await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "❌ Leave Request Rejected",
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Leave request from <@${leave.userId}> has been *rejected* by <@${body.user.id}>`
            }
          }
        ]
      });

      // Notify the requester
      await client.chat.postMessage({
        channel: leave.userId,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "❌ Leave Request Rejected",
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Your leave request has been rejected by *${approverInfo.user.real_name}*`
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Type:*\n${leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}`
              },
              {
                type: "mrkdwn",
                text: `*Duration:*\n${calculateDuration(leave.startDate, leave.endDate)} day(s)`
              },
              {
                type: "mrkdwn",
                text: `*From:*\n${formatDate(leave.startDate)}`
              },
              {
                type: "mrkdwn",
                text: `*To:*\n${formatDate(leave.endDate)}`
              }
            ]
          },
          approverNote ? {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Reason for Rejection:*\n${approverNote}`
            }
          } : null
        ].filter(Boolean)
      });

      console.log('Leave request rejected and notifications sent');

    } catch (error) {
      console.error('Error in reject action:', error);
    }
  });
};

module.exports = { registerApprovalCommand };