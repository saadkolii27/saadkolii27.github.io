// Simple client-side router for Appwrite application
class AppRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/index': 'index.html',
            '/login': 'index.html',
            '/about': 'about.html',
            '/services': 'services.html',
            '/contact': 'contact.html',
            '/team': 'team.html',
            '/careers': 'careers.html',
            '/dashboard': 'dashboard.html',
            '/admin': 'admin.html',
            '/signup': 'signup.html',
            '/404': '404.html'
        };
        
        this.currentPage = null;
        this.isNavigating = false;
        this.init();
    }
    
    init() {
        // Vérifier les redirections depuis la page 404
        this.checkRedirections();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Handle initial route
        this.handleRoute(window.location.pathname);
        
        // Intercept all internal links
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = new URL(anchor.href).pathname;
                this.navigate(path);
            }
        });
    }
    
    checkRedirections() {
        // Vérifier s'il y a un chemin de redirection depuis la page 404
        const redirectPath = sessionStorage.getItem('redirect-path');
        if (redirectPath) {
            console.log('Redirection détectée pour: ' + redirectPath);
            sessionStorage.removeItem('redirect-path');
            
            // Utiliser history API pour mettre à jour l'URL sans recharger la page
            history.replaceState(null, '', redirectPath);
            return true;
        }
        
        // Vérifier également les paramètres d'URL
        const urlParams = new URLSearchParams(window.location.search);
        const pathParam = urlParams.get('path');
        if (pathParam) {
            console.log('Paramètre de chemin détecté: ' + pathParam);
            history.replaceState(null, '', pathParam);
            return true;
        }
        
        return false;
    }
    
    handleRoute(path) {
        if (this.isNavigating) return;
        
        // Normaliser le chemin (enlever les slashes à la fin)
        path = path.replace(/\/$/, '') || '/';
        
        const route = this.routes[path] || this.routes['/404'];
        
        if (route && route !== this.currentPage) {
            this.loadPage(route, path);
        }
    }
    
    navigate(path) {
        if (this.isNavigating) return;
        
        // Update browser history
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }
    
    loadPage(page, path) {
        if (this.isNavigating || page === this.currentPage) return;
        
        this.isNavigating = true;
        this.currentPage = page;
        
        // Afficher un indicateur de chargement si nécessaire
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        
        // Utiliser fetch pour vérifier si la page existe
        fetch(page)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    console.error(`Page ${page} not found`);
                    return fetch('404.html').then(res => res.text());
                }
            })
            .then(html => {
                // Option 1: Si vous voulez remplacer uniquement le contenu principal
                const contentArea = document.getElementById('content');
                if (contentArea) {
                    // Extraire le contenu principal de la page chargée
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    const newContent = tempDiv.querySelector('#content');
                    if (newContent) {
                        contentArea.innerHTML = newContent.innerHTML;
                    } else {
                        contentArea.innerHTML = html;
                    }
                } else {
                    // Option 2: Si pas de zone de contenu, effectuer une redirection complète
                    window.location.href = page;
                }
                
                // Mettre à jour le titre de la page si disponible
                const newTitle = html.match(/<title>(.*?)<\/title>/i);
                if (newTitle && newTitle[1]) {
                    document.title = newTitle[1];
                }
                
                // Déclencher un événement pour informer que la page a changé
                window.dispatchEvent(new CustomEvent('pageChanged', {
                    detail: { path, page }
                }));
            })
            .catch(error => {
                console.error('Navigation error:', error);
                window.location.href = '404.html';
            })
            .finally(() => {
                this.isNavigating = false;
                
                // Cacher l'indicateur de chargement
                if (loadingIndicator) loadingIndicator.style.display = 'none';
            });
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