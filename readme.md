# User Authentication and Dashboard System

A modern, responsive web application built with JavaScript ES6+, Vite, TailwindCSS, and Appwrite backend for user authentication and dashboard management.

![Authentication Interface](https://github.com/user-attachments/assets/3b388e2b-5337-4f52-8111-2087008d33f5)

## 🚀 Features

### Authentication System
- **Sign Up**: Create new user accounts with full name, email, and password
- **Sign In**: Secure email/password authentication
- **Form Validation**: Real-time validation with error handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices

![Sign Up Form](https://github.com/user-attachments/assets/49cd2b9b-0df0-4aa1-b57c-ae390df6f4bc)

### User Dashboard
- **Profile Management**: Edit user name (editable field)
- **Account Information**: Display read-only data including:
  - User email (non-editable)
  - Unique user ID
  - Account creation date
  - Account verification status
  - Last updated timestamp
- **Account Statistics**: Overview of account information and status
- **Logout Functionality**: Secure session termination

![Dashboard Interface](https://github.com/user-attachments/assets/b66e8dd5-0fbb-4bf5-889e-4a45b1212dff)

### Mobile Responsive
- **Mobile-First Design**: Optimized for mobile devices
- **Responsive Layout**: Adapts to different screen sizes
- **Touch-Friendly Interface**: Easy navigation on mobile devices

![Mobile Dashboard](https://github.com/user-attachments/assets/03486b9a-85c3-4877-ad31-ea4b8726323d)

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript ES6+, HTML5, CSS3
- **Styling**: TailwindCSS with custom components
- **Build Tool**: Vite
- **Backend**: Appwrite (Authentication & Database)
- **Architecture**: Modern SPA with state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Appwrite project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saadkolii27/saadkolii27.github.io
   cd saadkolii27.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Appwrite configuration:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id-here
   VITE_APPWRITE_DATABASE_ID=your-database-id-here
   VITE_APPWRITE_COLLECTION_ID=your-collection-id-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Demo Mode
To see the dashboard without Appwrite configuration, visit: `http://localhost:5173?demo=true`

## 🏗️ Project Structure

```
├── lib/
│   └── appwrite.js          # Appwrite configuration
├── src/
│   └── main.js              # Main application logic
├── style/
│   └── app.css              # Custom styles and TailwindCSS
├── index.html               # Main HTML template
├── vite.config.js           # Vite configuration
├── .env.example             # Environment variables template
└── README.md                # Project documentation
```

## 🎨 Design Features

### Advanced CSS & Styling
- **Modern Gradient Backgrounds**: Beautiful gradient overlays
- **Glass Morphism Effects**: Subtle transparency and backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Shadow System**: Consistent drop shadows and elevation
- **Typography**: Inter font family for modern readability

### Responsive Breakpoints
- **Mobile**: 375px and up
- **Tablet**: 768px and up  
- **Desktop**: 1024px and up

### Interactive Elements
- **Form Validation**: Real-time validation feedback
- **Loading States**: Visual feedback during async operations
- **Error Handling**: User-friendly error messages
- **Success Messages**: Confirmation feedback

## 🔐 Authentication Flow

1. **User Registration**:
   - User fills sign-up form with name, email, password
   - Account created in Appwrite
   - Automatic sign-in after registration

2. **User Login**:
   - Email/password authentication
   - Session creation
   - Redirect to dashboard

3. **Dashboard Access**:
   - Protected route requiring authentication
   - User profile data loaded from Appwrite
   - Real-time profile updates

4. **Logout**:
   - Session termination
   - Redirect to authentication page

## 📱 Dashboard Features

### Editable Fields
- **Full Name**: Users can update their display name
- **Profile Updates**: Changes saved to Appwrite database

### Read-Only Information
- **Email Address**: Cannot be modified (security)
- **User ID**: Unique identifier display
- **Account Dates**: Creation and last update timestamps
- **Verification Status**: Account verification state

### Account Statistics
- **Real-time Data**: Live account information
- **Status Indicators**: Visual status representation
- **Account Type**: User role/type display

## 🔧 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- ES6+ JavaScript modules
- Async/await for API calls
- Class-based state management
- Functional component patterns

## 🌐 Deployment

This project is configured for GitHub Pages deployment:

1. **Build the project**: `npm run build`
2. **Deploy**: The `dist/` folder contains the production build
3. **GitHub Pages**: Automatically serves from the repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [View Dashboard](https://saadkolii27.github.io?demo=true)
- **Repository**: [GitHub](https://github.com/saadkolii27/saadkolii27.github.io)
- **Appwrite Documentation**: [appwrite.io/docs](https://appwrite.io/docs)