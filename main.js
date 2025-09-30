import { account } from './appwrite.js';

// Check authentication and redirect accordingly
async function checkAuth() {
  try {
    const user = await account.get();
    // User is authenticated, redirect to dashboard
    window.location.href = '/dashboard.html';
  } catch (error) {
    // User is not authenticated, redirect to login
    window.location.href = '/login.html';
  }
}

// Run on page load
checkAuth();
