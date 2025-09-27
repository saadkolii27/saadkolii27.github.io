# WebMonitor - Professional Website Change Monitoring Service

Welcome to WebMonitor, a comprehensive website monitoring solution that notifies customers when content changes occur on their monitored websites, powered by **Appwrite** as the backend platform.

## 🔍 What is WebMonitor?

WebMonitor is a professional service that continuously monitors websites for content changes and sends instant notifications via email and webhooks. Perfect for tracking competitors, monitoring news sites, or keeping tabs on any website updates that matter to your business.

## ✨ Features

- **🚀 Real-time Monitoring**: Continuous monitoring with intelligent change detection algorithms
- **📧 Smart Notifications**: Email alerts and webhook notifications when changes are detected
- **⚡ Fast & Reliable**: Lightning-fast checks with configurable monitoring frequencies
- **🎯 Customizable**: Set monitoring frequency from every 5 minutes to daily checks
- **🔗 Webhook Integration**: Send notifications to Slack, Discord, or any webhook endpoint
- **📊 Monitoring Dashboard**: Track all monitored websites and their status
- **💾 Cloud Storage**: All data securely stored in Appwrite cloud database
- **🔐 User Authentication**: Secure account system with Appwrite Auth

## 🚀 Getting Started with Appwrite

WebMonitor uses **Appwrite** as its backend-as-a-service platform for authentication, database, and cloud functions.

### Option 1: Clone the Appwrite Starter (Recommended)

1. Clone the starter kit from GitHub:
   ```bash
   git clone https://github.com/appwrite/starter-for-js
   cd starter-for-js
   ```

2. Copy `.env.example` to `.env` and update configuration:
   ```dotenv
   VITE_APPWRITE_PROJECT_ID = "68d6cf15003d05dbd780"
   VITE_APPWRITE_PROJECT_NAME = "ssaad.me"
   VITE_APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Click the **Send a ping** button to verify Appwrite setup.

### Option 2: Use This Repository Directly

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**: Create a `.env` file with your Appwrite settings:
   ```dotenv
   VITE_APPWRITE_PROJECT_ID = "your-project-id"
   VITE_APPWRITE_PROJECT_NAME = "your-project-name"
   VITE_APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🛠️ Appwrite Setup

### 1. Create Appwrite Project

1. Visit [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new project
3. Note your Project ID and Endpoint

### 2. Configure Database

Create the following collections in your Appwrite database:

#### Database: `webmonitor-db`

**Collection: `users`**
- Document ID: Auto-generate
- Attributes:
  - `name` (string, required)
  - `email` (string, required, unique)
  - `createdAt` (datetime)

**Collection: `monitored-sites`**
- Document ID: Auto-generate
- Attributes:
  - `userId` (string, required)
  - `url` (string, required)
  - `frequency` (integer, default: 30)
  - `webhookUrl` (string, optional)
  - `notes` (string, optional)
  - `status` (string, default: "active")
  - `lastChecked` (datetime)
  - `changesDetected` (integer, default: 0)
  - `contentHash` (string)
  - `createdAt` (datetime)

**Collection: `notifications`**
- Document ID: Auto-generate
- Attributes:
  - `userId` (string, required)
  - `siteId` (string, required)
  - `message` (string, required)
  - `type` (string, required)
  - `read` (boolean, default: false)
  - `createdAt` (datetime)

### 3. Set Permissions

Configure appropriate read/write permissions for each collection:
- Users can only access their own documents
- Authenticated users can create new documents
- Admin users can manage all documents

## 🚀 Development

### Frontend Development

```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Services (Optional)

For advanced features, you can still run the Node.js backend:

```bash
# Start API server
npm run api

# Start monitoring daemon
npm run monitor

# Add site via CLI
npm run add-site https://example.com user@email.com 30
```

## 📚 API Documentation

### Appwrite Integration

The application uses the following Appwrite services:

- **Authentication**: User registration, login, logout
- **Database**: Store monitored sites and notifications
- **Functions**: Server-side monitoring logic (optional)
- **Storage**: File uploads and assets (if needed)

### Key Methods

```javascript
import { appwriteService } from './appwrite.js';

// Authentication
await appwriteService.createAccount(email, password, name);
await appwriteService.login(email, password);
await appwriteService.logout();

// Database operations
await appwriteService.createMonitoredSite(siteData);
await appwriteService.getMonitoredSites(userId);
await appwriteService.updateMonitoredSite(siteId, updateData);
```

## 🔐 Security Features

- **Secure Authentication**: Powered by Appwrite's enterprise-grade auth
- **Data Isolation**: Each user only accesses their own data
- **Session Management**: Automatic token refresh and expiry
- **Input Validation**: Client and server-side validation
- **CORS Security**: Proper cross-origin request handling

## 📱 Features

### User Authentication
- Account creation and management
- Secure login/logout
- Session persistence
- Password reset (via Appwrite)

### Website Monitoring
- Real-time change detection
- Configurable check frequencies
- Email and webhook notifications
- Personal monitoring dashboard
- Change history and statistics

### Modern Web Platform
- Progressive Web App capabilities
- Responsive design
- Modern JavaScript (ES6+)
- Vite build system
- Hot module replacement

## 🌐 Deployment

### GitHub Pages (Static)
The frontend can be deployed to GitHub Pages:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages

### Appwrite Hosting
Deploy directly to Appwrite's hosting platform:

1. Connect your GitHub repository
2. Configure build settings
3. Automatic deployments on git push

### Other Platforms
- **Vercel**: Perfect for Vite apps
- **Netlify**: Great for static sites
- **Railway**: Full-stack deployment
- **DigitalOcean**: App platform deployment

## 🤝 Contributing

This is a modern web application built with:
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Appwrite (BaaS)
- **Build Tool**: Vite
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Database
- **Styling**: Professional CSS with glassmorphism design

## 📄 License

MIT License - see LICENSE file for details.

---

**WebMonitor** - Never miss important website changes again! 🚀

Powered by **Appwrite** ⚡
