const { formatDate } = require('../utils/date');

const registerLeaveCommand = (app) => {
  app.command('/apply-leave', async ({ ack, body, client }) => {
    try {
      await ack();
      console.log('Command received:', body);
      
      const userList = await client.users.list();  
      console.log('Users fetched:', userList.members.length);

      const userOptions = userList.members  
        .filter(user => !user.is_bot && user.id !== body.user_id)
        .map(user => ({
          text: {
            type: 'plain_text',
            text: user.real_name || user.name
          },
          value: user.id
        }));

      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'leave_request',
          title: {
            type: 'plain_text',
            text: 'Request Leave'
          },
          blocks: [
            {
              type: 'input',
              block_id: 'date_start',
              label: {
                type: 'plain_text',
                text: 'Start Date'
              },
              element: {
                type: 'datepicker',
                action_id: 'start_date'
              }
            },
            {
              type: 'input',
              block_id: 'date_end',
              label: {
                type: 'plain_text',
                text: 'End Date'
              },
              element: {
                type: 'datepicker',
                action_id: 'end_date'
              }
            },
            {
              type: 'input',
              block_id: 'leave_type',
              label: {
                type: 'plain_text',
                text: 'Leave Type'
              },
              element: {
                type: 'static_select',
                action_id: 'type',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Vacation'
                    },
                    value: 'vacation'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Sick'
                    },
                    value: 'sick'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Personal'
                    },
                    value: 'personal'
                  }
                ]
              }
            },
            {
              type: 'input',
              block_id: 'manager_select',
              label: {
                type: 'plain_text',
                text: 'Select Approver'
              },
              element: {
                type: 'static_select',
                action_id: 'manager',
                options: userOptions
              }
            },
            {
              type: 'input',
              block_id: 'notes',
              label: {
                type: 'plain_text',
                text: 'Additional Notes'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'note_text',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: 'Add any additional information here...'
                }
              },
              optional: true
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      });
      console.log('Modal opened successfully:', result.view.id);
    } catch (error) {
      console.error('Error in apply-leave command:', error);
    }
  });
};

module.exports = { registerLeaveCommand };