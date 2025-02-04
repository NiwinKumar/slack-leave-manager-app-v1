cat << 'EOF' > README.md
# Slack Leave Manager

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Architecture](#architecture)

## Overview
A Slack bot for managing employee leave requests with approval workflow.

## Features
✓ Submit leave requests via /apply-leave
✓ Interactive forms with date picker
✓ Multiple leave types (sick, vacation, personal) 
✓ Approval/rejection with notes
✓ Real-time notifications
✓ MongoDB persistence

## Prerequisites
- Node.js >= 14
- MongoDB Atlas account
- Slack workspace admin access

## Installation
\`\`\`bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/slack-leave-manager.git
cd slack-leave-manager

# Install dependencies
npm install

# Configure environment 
cp .env.example .env
\`\`\`

## Configuration
1. Create Slack App:
   - Visit https://api.slack.com/apps
   - Create New App > From scratch
   - Enable Socket Mode
   - Add scopes:
     - chat:write
     - commands  
     - users:read

2. Set Environment Variables:
\`\`\`bash
# .env file
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-secret
SLACK_APP_TOKEN=xapp-your-token
DATABASE_URL=mongodb+srv://...
\`\`\`

## Usage
\`\`\`bash
# Development
npm run dev 

# Production
npm start
\`\`\`

In Slack:
1. Type /apply-leave
2. Fill form details
3. Submit request
4. Approver receives notification
5. Request approved/rejected
6. Requester notified of decision

## Development
\`\`\`bash
# Install dev dependencies
npm install --save-dev nodemon eslint

# Run linter
npm run lint

# Run tests
npm test

# Build
npm run build
\`\`\`

## Architecture
- Node.js + Bolt Framework
- MongoDB Atlas
- Socket Mode API
- Event-driven architecture
- MVC pattern

## Project Structure
\`\`\`
slack-leave-manager/
├── src/
│   ├── app.js          # Entry point
│   ├── bot/            # Bot logic
│   ├── commands/       # Command handlers  
│   ├── db/            # Database models
│   └── utils/         # Helper functions
├── .env               # Environment vars
└── package.json
\`\`\`

## License
MIT © [NIWIN_KUMAR]
EOF

# Display README
cat README.md