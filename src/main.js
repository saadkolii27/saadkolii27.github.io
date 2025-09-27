// Main application entry point
import { client, account, databases } from './lib/appwrite.js';
import { TicketPlatform } from './src/TicketPlatform.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new TicketPlatform();
    app.init();
});