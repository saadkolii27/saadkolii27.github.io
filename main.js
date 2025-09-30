import { account } from './appwrite.js';


// Affiche une erreur sur la page
function showDebugError(message) {
  let debugDiv = document.getElementById('debug-error');
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.id = 'debug-error';
    debugDiv.style.background = '#fee2e2';
    debugDiv.style.color = '#b91c1c';
    debugDiv.style.padding = '1rem';
    debugDiv.style.margin = '1rem auto';
    debugDiv.style.maxWidth = '500px';
    debugDiv.style.borderRadius = '8px';
    debugDiv.style.fontWeight = 'bold';
    document.body.prepend(debugDiv);
  }
  debugDiv.textContent = message;
}

// Check authentication and redirect accordingly
async function checkAuth() {
  try {
    const user = await account.get();
    // User is authenticated, redirect to dashboard
    window.location.href = '/dashboard.html';
  } catch (error) {
    // Affiche l'erreur pour debug
    showDebugError('Erreur Appwrite : ' + (error.message || error.toString()));
    // User is not authenticated, redirect to login après 3s
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 3000);
  }
}

// Run on page load
checkAuth();
