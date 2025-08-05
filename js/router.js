// Simple client-side router for Appwrite application
class AppRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/index': 'index.html',
            '/login': 'index.html',
            '/dashboard': 'dashboard.html',
            '/admin': 'admin.html',
            '/signup': 'signup.html',
            '/404': '404.html'
        };
        
        this.currentPage = null;
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
        const route = this.routes[path] || this.routes['/404'];
        
        if (route && route !== this.currentPage) {
            this.loadPage(route);
        }
    }
    
    navigate(path) {
        // Update browser history
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }
    
    loadPage(page) {
        // Simple page loading - just redirect to the actual file
        if (page !== this.currentPage) {
            this.currentPage = page;
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
    console.error('Navigation error:', e);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled navigation error:', e);
});