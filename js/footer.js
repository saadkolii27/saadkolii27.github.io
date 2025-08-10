// Footer Component
class Footer {
    constructor() {
        this.init();
    }

    init() {
        this.createFooter();
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.className = 'footer';
        footer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>SSAAD</h3>
                        <p>Votre partenaire de confiance pour des solutions innovantes et durables.</p>
                        <div class="social-links">
                            <a href="#" aria-label="Facebook">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="/services#web-development">Développement Web</a></li>
                            <li><a href="/services#mobile-apps">Applications Mobiles</a></li>
                            <li><a href="/services#cloud-solutions">Solutions Cloud</a></li>
                            <li><a href="/services#consulting">Consulting</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Entreprise</h3>
                        <ul>
                            <li><a href="/about">À propos</a></li>
                            <li><a href="/team">Notre équipe</a></li>
                            <li><a href="/careers">Carrières</a></li>
                            <li><a href="/news">Actualités</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/help">Centre d'aide</a></li>
                            <li><a href="/documentation">Documentation</a></li>
                            <li><a href="/status">État des services</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} SSAAD. Tous droits réservés.</p>
                    <div class="footer-legal">
                        <a href="/privacy">Politique de confidentialité</a>
                        <span class="separator">•</span>
                        <a href="/terms">Conditions d'utilisation</a>
                        <span class="separator">•</span>
                        <a href="/cookies">Cookies</a>
                    </div>
                </div>
            </div>
        `;

        // Add footer styles
        const footerStyles = document.createElement('style');
        footerStyles.textContent = `
            .footer {
                background-color: var(--gray-900);
                color: var(--gray-300);
                padding: var(--spacing-16) 0 var(--spacing-8);
            }
            
            .footer-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--spacing-8);
                margin-bottom: var(--spacing-8);
            }
            
            .footer-section h3 {
                color: var(--white);
                margin-bottom: var(--spacing-4);
                font-size: var(--font-size-lg);
                font-weight: 600;
            }
            
            .footer-section p {
                color: var(--gray-400);
                margin-bottom: var(--spacing-4);
                line-height: 1.6;
            }
            
            .footer-section ul {
                list-style: none;
            }
            
            .footer-section ul li {
                margin-bottom: var(--spacing-2);
            }
            
            .footer-section a {
                color: var(--gray-400);
                transition: color var(--transition-fast);
                text-decoration: none;
            }
            
            .footer-section a:hover {
                color: var(--white);
            }
            
            .social-links {
                display: flex;
                gap: var(--spacing-4);
                margin-top: var(--spacing-4);
            }
            
            .social-links a {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background-color: var(--gray-800);
                border-radius: var(--radius-md);
                transition: all var(--transition-fast);
            }
            
            .social-links a:hover {
                background-color: var(--primary-color);
                transform: translateY(-2px);
            }
            
            .footer-bottom {
                text-align: center;
                padding-top: var(--spacing-8);
                border-top: 1px solid var(--gray-800);
            }
            
            .footer-bottom p {
                margin-bottom: var(--spacing-4);
                color: var(--gray-400);
            }
            
            .footer-legal {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-4);
                flex-wrap: wrap;
            }
            
            .footer-legal a {
                color: var(--gray-500);
                font-size: var(--font-size-sm);
                transition: color var(--transition-fast);
            }
            
            .footer-legal a:hover {
                color: var(--white);
            }
            
            .separator {
                color: var(--gray-600);
                font-size: var(--font-size-sm);
            }
            
            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-6);
                }
                
                .footer-legal {
                    flex-direction: column;
                    gap: var(--spacing-2);
                }
                
                .separator {
                    display: none;
                }
            }
        `;

        document.head.appendChild(footerStyles);
        
        // Insert footer at the end of the body
        document.body.appendChild(footer);
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.footer = new Footer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
}