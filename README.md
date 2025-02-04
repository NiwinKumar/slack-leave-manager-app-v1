text
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
- [Project Structure](#project-structure)
- [License](#license)

## Overview
Slack Leave Manager is a Slack bot designed to manage employee leave requests with an efficient approval workflow.

## Features
- ✓ Submit leave requests via `/apply-leave`
- ✓ Interactive forms with date picker
- ✓ Multiple leave types (sick, vacation, personal)
- ✓ Approval/rejection with optional notes
- ✓ Real-time notifications
- ✓ MongoDB persistence

## Prerequisites
- Node.js version 14 or higher
- MongoDB Atlas account
- Admin access to a Slack workspace

## Installation
Clone the repository
git clone https://github.com/YOUR_USERNAME/slack-leave-manager.git
cd slack-leave-manager
Install dependencies
npm install
Configure environment variables
cp .env.example .env
text

## Configuration
1. **Create a Slack App:**
   - Visit [Slack API Apps](https://api.slack.com/apps).
   - Click on "Create New App" > "From scratch".
   - Enable Socket Mode.
   - Add the following scopes:
     - `chat:write`
     - `commands`  
     - `users:read`

2. **Set Environment Variables:**
.env file configuration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-secret
SLACK_APP_TOKEN=xapp-your-token
DATABASE_URL=mongodb+srv://...
text

## Usage
For development mode
npm run dev
For production mode
npm start
text

### In Slack:
1. Type `/apply-leave`.
2. Fill in the form details.
3. Submit your request.
4. The approver receives a notification.
5. The request is approved or rejected.
6. The requester is notified of the decision.

## Development
Install development dependencies
npm install --save-dev nodemon eslint
Run linter to check code quality
npm run lint
Run tests to ensure functionality
npm test
Build the project for production
npm run build
text

## Architecture
- Built using Node.js and the Bolt Framework.
- Utilizes MongoDB Atlas for data persistence.
- Implements Socket Mode API for real-time interactions.
- Follows an event-driven architecture and MVC pattern.

## Project Structure
slack-leave-manager/
├── src/
│ ├── app.js # Entry point of the application
│ ├── bot/ # Contains bot logic and handlers
│ ├── commands/ # Command handlers for Slack commands
│ ├── db/ # Database models and schemas
│ └── utils/ # Helper functions and utilities
├── .env # Environment variable configuration file
└── package.json # Project metadata and dependencies
text

## License
MIT © [NIWIN_KUMAR]
