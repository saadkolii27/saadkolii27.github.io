// Simple client-side router for Appwrite application
class AppRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/index': 'index.html',
            '/login': 'index.html',
            '/dashboard': 'dashboard.html',
            '/admin': 'admin.html',
            '/signup': 'signup.html'
        };
        
        this.init();
    }
    
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Handle initial route
        this.handleRoute(window.location.pathname);
        
        // Intercept all internal links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = new URL(e.target.href).pathname;
                this.navigate(path);
            }
        });
    }
    
    handleRoute(path) {
        const route = this.routes[path];
        
        if (route) {
            this.loadPage(route);
        } else {
            // If no route found, show 404 popup
            if (window.error404Popup) {
                window.error404Popup.show();
            } else {
                // Fallback to redirect if popup not available
                window.location.href = '404.html';
            }
        }
    }
    
    navigate(path) {
        // Update browser history
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }
    
    loadPage(page) {
        // For now, we'll use simple redirects
        // In a more complex SPA, you would load content dynamically
        if (window.location.pathname !== '/' + page) {
            window.location.href = page;
        }
    }
    
    // Utility method to check if a route exists
    routeExists(path) {
        return this.routes.hasOwnProperty(path);
    }
    
    // Add a new route dynamically
    addRoute(path, page) {
        this.routes[path] = page;
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appRouter = new AppRouter();
});

// Global navigation function
function navigateTo(path) {
    if (window.appRouter) {
        window.appRouter.navigate(path);
    } else {
        window.location.href = path;
    }
}

// Error handling for navigation
window.addEventListener('error', (e) => {
    if (e.message.includes('general_route_not_found') || e.message.includes('Page not found')) {
        console.error('Navigation error detected, redirecting to 404');
        window.location.href = '404.html';
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && (e.reason.message.includes('general_route_not_found') || e.reason.message.includes('Page not found'))) {
        console.error('Unhandled navigation error, redirecting to 404');
        window.location.href = '404.html';
    }
});