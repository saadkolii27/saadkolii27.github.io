// Navigation Component
class Navigation {
    constructor() {
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.createNavigation();
        this.bindEvents();
        this.updateActiveLink();
    }

    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'navbar';
        nav.innerHTML = `
            <div class="container">
                <div class="navbar-container">
                    <a href="/" class="navbar-brand">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        SSAAD
                    </a>
                    
                    <ul class="navbar-nav">
                        <li><a href="/" class="nav-link" data-page="home">Accueil</a></li>
                        <li><a href="/about" class="nav-link" data-page="about">À propos</a></li>
                        <li><a href="/services" class="nav-link" data-page="services">Services</a></li>
                        <li><a href="/contact" class="nav-link" data-page="contact">Contact</a></li>
                        <li><a href="/dashboard" class="nav-link" data-page="dashboard">Tableau de bord</a></li>
                    </ul>
                    
                    <div class="navbar-toggle" id="mobileMenuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        // Insert navigation at the beginning of the body
        document.body.insertBefore(nav, document.body.firstChild);
    }

    bindEvents() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle navigation link clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href && href !== window.location.pathname) {
                    navigateTo(href);
                }
            }
        });

        // Update active link on route change
        window.addEventListener('pageChanged', () => {
            this.updateActiveLink();
        });
    }

    toggleMobileMenu() {
        const navbarNav = document.querySelector('.navbar-nav');
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const navbarNav = document.querySelector('.navbar-nav');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        navbarNav.classList.add('active');
        mobileToggle.classList.add('active');
        this.isMobileMenuOpen = true;
        
        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    closeMobileMenu() {
        const navbarNav = document.querySelector('.navbar-nav');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        navbarNav.classList.remove('active');
        mobileToggle.classList.remove('active');
        this.isMobileMenuOpen = false;
        
        // Reset hamburger animation
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    updateActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            }
        });
    }

    // Method to show/hide navigation based on authentication
    setAuthState(isAuthenticated, isAdmin = false) {
        const dashboardLink = document.querySelector('[data-page="dashboard"]');
        const adminLink = document.querySelector('[data-page="admin"]');
        
        if (dashboardLink) {
            dashboardLink.style.display = isAuthenticated ? 'block' : 'none';
        }
        
        if (adminLink) {
            adminLink.style.display = (isAuthenticated && isAdmin) ? 'block' : 'none';
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}