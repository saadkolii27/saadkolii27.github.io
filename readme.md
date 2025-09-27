# WebMonitor - Professional Website Change Monitoring Service

Welcome to WebMonitor, a comprehensive website monitoring solution that notifies customers when content changes occur on their monitored websites.

## 🔍 What is WebMonitor?

WebMonitor is a professional service that continuously monitors websites for content changes and sends instant notifications via email and webhooks. Perfect for tracking competitors, monitoring news sites, or keeping tabs on any website updates that matter to your business.

## ✨ Features

- **🚀 Real-time Monitoring**: Continuous monitoring with intelligent change detection algorithms
- **📧 Smart Notifications**: Email alerts and webhook notifications when changes are detected
- **⚡ Fast & Reliable**: Lightning-fast checks with configurable monitoring frequencies
- **🎯 Customizable**: Set monitoring frequency from every 5 minutes to daily checks
- **🔗 Webhook Integration**: Send notifications to Slack, Discord, or any webhook endpoint
- **📊 Monitoring Dashboard**: Track all monitored websites and their status
- **💾 Persistent Storage**: All monitoring data is saved and survives restarts

## 🚀 Getting Started

### Frontend Interface

Visit the website and use the intuitive interface to:

1. **Add a Website**: Enter the URL you want to monitor
2. **Set Notification Email**: Provide your email for change alerts
3. **Choose Frequency**: Select how often to check for changes
4. **Optional Webhook**: Add webhook URL for external integrations
5. **Add Notes**: Specify what content areas to focus on

### Backend Services

The monitoring system includes two main components:

#### 1. API Server (`api-server.js`)
Handles communication between the frontend and monitoring service.

```bash
# Start the API server
npm run api

# Health check
curl http://localhost:3000/api/health
```

#### 2. Monitoring Service (`monitor-service.js`)
The core monitoring engine that checks websites for changes.

```bash
# Start monitoring daemon
npm run monitor

# Add a site via CLI
npm run add-site https://example.com user@email.com 30

# List all monitored sites
npm run list-sites
```

## 🛠️ Development

### Local Development Setup

1. **Start the frontend:**
   ```bash
   npm start
   # or
   npm run dev
   # Opens on http://localhost:8000
   ```

2. **Start the API server:**
   ```bash
   npm run api
   # API available on http://localhost:3000
   ```

3. **Start the monitoring daemon:**
   ```bash
   npm run monitor
   # Runs continuously in background
   ```

### Production Deployment

For production deployment, you'll need:

1. **Web Server**: Serve the static HTML/CSS/JS files
2. **API Server**: Deploy the Node.js API server
3. **Monitoring Service**: Run the monitoring daemon as a background service
4. **Email Service**: Configure with SendGrid, AWS SES, or similar
5. **Database**: Optional - upgrade from file storage to database

## 📚 API Documentation

### GET /api/sites
List all monitored sites.

**Response:**
```json
{
  "sites": [
    {
      "id": "uuid",
      "url": "https://example.com",
      "email": "user@example.com",
      "frequency": 30,
      "status": "active",
      "changesDetected": 2,
      "lastChecked": "2025-01-20T10:30:00Z"
    }
  ]
}
```

### POST /api/sites
Add a new site to monitor.

**Request:**
```json
{
  "url": "https://example.com",
  "email": "user@example.com",
  "frequency": 30,
  "webhookUrl": "https://hooks.slack.com/webhook",
  "notes": "Monitor the homepage"
}
```

### DELETE /api/sites/:id
Remove a monitored site.

## 🔧 Configuration

### Monitoring Frequencies
- Every 5 minutes
- Every 15 minutes  
- Every 30 minutes (default)
- Every hour
- Every 6 hours
- Once daily

### Notification Methods
- **Email**: Direct email notifications (requires email service setup)
- **Webhooks**: HTTP POST requests to any webhook URL
- **Browser Notifications**: Real-time notifications in the browser

## 🚨 Change Detection Algorithm

WebMonitor uses intelligent content hashing to detect changes:

1. **Content Fetching**: Downloads the full webpage content
2. **Content Cleaning**: Removes timestamps, nonces, and dynamic elements
3. **Hash Generation**: Creates SHA-256 hash of cleaned content
4. **Change Detection**: Compares current hash with stored hash
5. **Notification**: Sends alerts when hashes differ

## 📁 File Structure

```
├── index.html           # Frontend interface
├── api-server.js        # HTTP API server
├── monitor-service.js   # Core monitoring engine
├── package.json         # Node.js dependencies and scripts
├── monitored-sites.json # Data storage (auto-generated)
└── README.md           # This documentation
```

## 🔐 Security Considerations

- Input validation for URLs and email addresses
- Rate limiting to prevent abuse
- CORS configuration for API access
- Secure webhook payload signing (recommended for production)
- Environment variables for sensitive configuration

## 🤝 Support

This is a professional website monitoring service. For support or feature requests, please contact the development team.

## 📄 License

MIT License - see LICENSE file for details.

---

**WebMonitor** - Never miss important website changes again! 🚀
