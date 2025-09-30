# User Authentication System

A complete authentication system with login, signup, and dashboard pages built with Tailwind CSS and Appwrite.

## Features

- **Login Page** (`/login.html`) - User authentication with email and password
- **Sign Up Page** (`/signup.html`) - New user registration with name, email, and password
- **Dashboard** (`/dashboard.html`) - Protected user dashboard with user information and stats
- **Auto-redirect** - Index page automatically redirects based on authentication status

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS v4, Vanilla JavaScript (ES6 modules)
- **Backend**: Appwrite for authentication
- **Build Tool**: Vite

## Project Structure

```
.
├── index.html          # Landing page with auto-redirect
├── login.html          # Login page
├── signup.html         # Sign up page
├── dashboard.html      # User dashboard
├── main.js            # Index page logic
├── auth.js            # Login/signup authentication logic
├── dashboard.js       # Dashboard logic
├── appwrite.js        # Appwrite client configuration
├── style.css          # Tailwind CSS imports
└── vite.config.js     # Vite configuration with Tailwind plugin
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Appwrite credentials in `.env`:
```
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_PROJECT_NAME=your-project-name
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Authentication Flow

1. **Index Page**: Checks if user is authenticated
   - If authenticated → redirects to dashboard
   - If not authenticated → redirects to login

2. **Login/Signup**: Validates credentials with Appwrite
   - On success → redirects to dashboard
   - On error → displays error message

3. **Dashboard**: Protected route
   - Displays user information
   - Provides logout functionality
   - If not authenticated → redirects to login

## Pages

### Login Page
- Email and password input fields
- Link to create new account
- Error message display
- Form validation

### Sign Up Page
- Name, email, and password input fields
- Password minimum length validation (8 characters)
- Link to existing account login
- Automatic login after successful registration

### Dashboard
- Navigation bar with user name and logout button
- Welcome message
- User information section (name, email, ID, verification status)
- Status cards (Account Status, Session Status, Account Type)
- Quick action buttons (Edit Profile, Change Password, Settings)

## License

MIT
