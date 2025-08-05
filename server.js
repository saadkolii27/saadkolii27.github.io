const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Handle all routes and serve appropriate HTML files
app.get('*', (req, res) => {
    const requestedPath = req.path;
    
    // List of valid routes
    const validRoutes = {
        '/': 'index.html',
        '/index': 'index.html',
        '/login': 'index.html',
        '/dashboard': 'dashboard.html',
        '/admin': 'admin.html',
        '/signup': 'signup.html'
    };
    
    // Check if the requested path is a valid route
    if (validRoutes[requestedPath]) {
        const filePath = path.join(__dirname, validRoutes[requestedPath]);
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.redirect('/?error=404');
        }
    } else {
        // Check if it's a direct file request
        const filePath = path.join(__dirname, requestedPath);
        
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.sendFile(filePath);
        } else {
            // Route not found, redirect to home with 404 error parameter
            res.redirect('/?error=404');
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).sendFile(path.join(__dirname, '404.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.redirect('/?error=404');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('- / (login page)');
    console.log('- /dashboard (user dashboard)');
    console.log('- /admin (admin panel)');
    console.log('- /signup (registration page)');
});