import { account } from './appwrite.js';
import { ID } from 'appwrite';

// Check if user is already logged in
async function checkAuth() {
  try {
    await account.get();
    window.location.href = '/dashboard.html';
  } catch (error) {
    // User not logged in, stay on this page
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  errorText.textContent = message;
  errorDiv.classList.remove('hidden');
}

// Hide error message
function hideError() {
  const errorDiv = document.getElementById('error-message');
  errorDiv.classList.add('hidden');
}

// Login functionality
async function handleLogin(e) {
  e.preventDefault();
  hideError();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await account.createEmailPasswordSession(email, password);
    window.location.href = '/dashboard.html';
  } catch (error) {
    showError(error.message || 'Login failed. Please check your credentials.');
  }
}

// Signup functionality
async function handleSignup(e) {
  e.preventDefault();
  hideError();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (password.length < 8) {
    showError('Password must be at least 8 characters long.');
    return;
  }

  try {
    // Create account
    await account.create(ID.unique(), email, password, name);
    
    // Log in the user automatically
    await account.createEmailPasswordSession(email, password);
    
    window.location.href = '/dashboard.html';
  } catch (error) {
    showError(error.message || 'Signup failed. Please try again.');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});
