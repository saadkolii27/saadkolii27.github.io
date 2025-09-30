import { account } from './appwrite.js';

// Check authentication and load user data
async function loadDashboard() {
  try {
    const user = await account.get();
    
    // Update UI with user information
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('welcome-name').textContent = user.name;
    document.getElementById('info-name').textContent = user.name;
    document.getElementById('info-email').textContent = user.email;
    document.getElementById('info-id').textContent = user.$id;
    
    const verifiedElement = document.getElementById('info-verified');
    if (user.emailVerification) {
      verifiedElement.innerHTML = '<span class="text-green-600">✓ Verified</span>';
    } else {
      verifiedElement.innerHTML = '<span class="text-yellow-600">⚠ Not Verified</span>';
    }
  } catch (error) {
    // User not authenticated, redirect to login
    window.location.href = '/login.html';
  }
}

// Handle logout
async function handleLogout() {
  try {
    await account.deleteSession('current');
    window.location.href = '/login.html';
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, redirect to login
    window.location.href = '/login.html';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});
