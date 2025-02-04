const { formatDate, calculateDuration } = require('./date');

const createLeaveRequestMessage = (leaveRequest, user, requesterInfo) => {
  const duration = calculateDuration(leaveRequest.startDate, leaveRequest.endDate);
  
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📋 New Leave Request",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*From:* ${requesterInfo.fullName} (<@${user}>)`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Leave Type:*\n${leaveRequest.type.charAt(0).toUpperCase() + leaveRequest.type.slice(1)}`
          },
          {
            type: "mrkdwn",
            text: `*Duration:*\n${duration} day(s)`
          },
          {
            type: "mrkdwn",
            text: `*Start Date:*\n${formatDate(leaveRequest.startDate)}`
          },
          {
            type: "mrkdwn",
            text: `*End Date:*\n${formatDate(leaveRequest.endDate)}`
          }
        ]
      },
      leaveRequest.notes ? {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Additional Notes:*\n${leaveRequest.notes}`
        }
      } : null,
      {
        type: "input",
        block_id: "approver_note",
        optional: true,
        label: {
          type: "plain_text",
          text: "Add a note (optional)",
          emoji: true
        },
        element: {
          type: "plain_text_input",
          action_id: "note_input",
          placeholder: {
            type: "plain_text",
            text: "Enter your response..."
          },
          multiline: true
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "✅ Approve",
              emoji: true
            },
            style: "primary",
            value: leaveRequest._id.toString(),
            action_id: "approve_leave"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "❌ Reject",
              emoji: true
            },
            style: "danger",
            value: leaveRequest._id.toString(),
            action_id: "reject_leave"
          }
        ]
      }
    ].filter(Boolean)
  };
};

module.exports = { createLeaveRequestMessage };