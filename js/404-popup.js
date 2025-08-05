// 404 Popup Component
class Error404Popup {
    constructor() {
        this.isVisible = false;
        this.init();
    }
    
    init() {
        // Create popup HTML
        this.createPopupHTML();
        
        // Add event listeners
        this.addEventListeners();
        
        // Check for 404 errors on page load
        this.checkFor404Error();
    }
    
    createPopupHTML() {
        const popupHTML = `
            <div id="error404Popup" class="error404-popup" style="display: none;">
                <div class="error404-overlay"></div>
                <div class="error404-content">
                    <div class="error404-header">
                        <h2>Page non trouvée</h2>
                        <button class="error404-close" id="error404Close">&times;</button>
                    </div>
                    <div class="error404-body">
                        <div class="error404-icon">404</div>
                        <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
                        <div class="error404-actions">
                            <button class="btn btn-primary" onclick="window.location.href='index.html'">Accueil</button>
                            <button class="btn btn-secondary" onclick="window.location.href='dashboard.html'">Tableau de bord</button>
                        </div>
                        <div class="error404-links">
                            <a href="signup.html">Inscription</a>
                            <a href="admin.html">Administration</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = `
            <style>
                .error404-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .error404-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }
                
                .error404-content {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    z-index: 10000;
                    animation: error404SlideIn 0.3s ease-out;
                }
                
                @keyframes error404SlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .error404-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem 1rem;
                    border-bottom: 1px solid #eee;
                }
                
                .error404-header h2 {
                    color: #333;
                    font-size: 1.5rem;
                    margin: 0;
                }
                
                .error404-close {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .error404-close:hover {
                    background: #f5f5f5;
                    color: #333;
                }
                
                .error404-body {
                    padding: 2rem;
                    text-align: center;
                }
                
                .error404-icon {
                    font-size: 4rem;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 1rem;
                    line-height: 1;
                }
                
                .error404-body p {
                    color: #666;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                    font-size: 1.1rem;
                }
                
                .error404-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 2rem;
                }
                
                .btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 5px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    transition: transform 0.2s ease;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .btn-secondary {
                    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
                    color: white;
                }
                
                .error404-links {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                }
                
                .error404-links a {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                
                .error404-links a:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .error404-content {
                        width: 95%;
                        margin: 1rem;
                    }
                    
                    .error404-actions {
                        flex-direction: column;
                    }
                    
                    .error404-links {
                        flex-direction: column;
                        gap: 1rem;
                    }
                }
            </style>
        `;
        
        // Add HTML and styles to document
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    addEventListeners() {
        // Close button
        document.getElementById('error404Close').addEventListener('click', () => {
            this.hide();
        });
        
        // Close on overlay click
        document.querySelector('.error404-overlay').addEventListener('click', () => {
            this.hide();
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    show() {
        if (this.isVisible) return;
        
        const popup = document.getElementById('error404Popup');
        popup.style.display = 'flex';
        this.isVisible = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Log the error
        console.log('404 Error Popup shown');
        console.log('Current URL:', window.location.href);
    }
    
    hide() {
        if (!this.isVisible) return;
        
        const popup = document.getElementById('error404Popup');
        popup.style.display = 'none';
        this.isVisible = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    checkFor404Error() {
        // Check if current page is 404.html
        if (window.location.pathname.includes('404.html')) {
            this.show();
            // Update URL to remove 404.html
            window.history.replaceState({}, '', window.location.pathname.replace('404.html', ''));
        }
        
        // Check for 404 error in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error') === '404') {
            this.show();
            // Remove error parameter from URL
            urlParams.delete('error');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }
    }
}

// Global function to show 404 popup
function show404Popup() {
    if (window.error404Popup) {
        window.error404Popup.show();
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.error404Popup = new Error404Popup();
});

// Handle navigation errors
window.addEventListener('error', (e) => {
    if (e.message.includes('general_route_not_found') || e.message.includes('Page not found')) {
        console.error('Navigation error detected, showing 404 popup');
        show404Popup();
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && (e.reason.message.includes('general_route_not_found') || e.reason.message.includes('Page not found'))) {
        console.error('Unhandled navigation error, showing 404 popup');
        show404Popup();
    }
});