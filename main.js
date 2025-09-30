/**
 * Script JavaScript Avancé
 * ------------------------
 * Animations et interactions pour le site
 * Comprend:
 * - Animations avancées avec GSAP (simulé)
 * - Effets parallaxe et 3D
 * - Détection d'intersection pour animations au défilement
 * - Gestion avancée du menu mobile
 * - Effets de particules
 * - Transitions fluides entre pages
 * - Gestion des thèmes sombre/clair
 * - Composants interactifs (accordéon, carousel, compteurs)
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser toutes les fonctionnalités
  initHeaderScroll();
  initSmoothScroll();
  initParallaxEffects();
  initWelcomeAnimations();
  initIntersectionAnimations();
  createParticles();
  initMobileMenu();
  init3DCards();
  initAccordion();
  initCounters();
  initCarousel();
  initTooltips();
  initThemeToggle();
});

/**
 * Animation de l'en-tête lors du défilement
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * Défilement fluide pour les liens d'ancrage
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Ajouter un effet de pulsation avant le défilement
        targetElement.classList.add('pulse');
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajuster pour l'en-tête fixe
          behavior: 'smooth'
        });
        
        // Supprimer l'effet après l'animation
        setTimeout(() => {
          targetElement.classList.remove('pulse');
        }, 2000);
      }
    });
  });
}

/**
 * Effets de parallaxe avancés
 */
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax');
  const welcomeContainer = document.querySelector('.welcome-container');
  
  if (welcomeContainer) {
    // Parallaxe sur mouvement de souris avec effet 3D
    document.addEventListener('mousemove', (e) => {
      const xPos = (e.clientX / window.innerWidth - 0.5);
      const yPos = (e.clientY / window.innerHeight - 0.5);
      
      const layers = welcomeContainer.querySelectorAll('.depth-layer');
      
      // Parallaxe différencié selon la profondeur
      layers.forEach((layer, index) => {
        const speed = (index + 1) * 20;
        const x = xPos * speed;
        const y = yPos * speed;
        layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
      
      // Effet de rotation 3D subtile
      welcomeContainer.style.transform = `rotateX(${yPos * 2}deg) rotateY(${-xPos * 2}deg)`;
    });
    
    // Réinitialiser la position lorsque la souris quitte la fenêtre
    document.addEventListener('mouseleave', () => {
      const layers = welcomeContainer.querySelectorAll('.depth-layer');
      
      layers.forEach(layer => {
        layer.style.transform = 'translateX(0) translateY(0)';
      });
      
      welcomeContainer.style.transform = 'rotateX(0) rotateY(0)';
    });
  }
  
  // Parallaxe au défilement
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = window.scrollY * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

/**
 * Animations pour le conteneur de bienvenue
 */
function initWelcomeAnimations() {
  const welcomeContainer = document.querySelector('.welcome-container');
  
  if (!welcomeContainer) return;
  
  // Créer et ajouter des cercles décoratifs dynamiquement
  const circles = [
    { class: 'circle-1', size: 300 },
    { class: 'circle-2', size: 250 },
    { class: 'circle-3', size: 200 }
  ];
  
  circles.forEach(circle => {
    const element = document.createElement('div');
    element.classList.add('decoration-circle', circle.class);
    welcomeContainer.appendChild(element);
  });
  
  // Animer les éléments de texte séquentiellement
  // Cette animation est maintenant gérée par CSS, mais nous pouvons ajouter des effets supplémentaires
  
  // Ajouter un effet de flottement après les animations initiales
  setTimeout(() => {
    welcomeContainer.classList.add('float');
  }, 3000);
}

/**
 * Animations déclenchées lors du défilement (Intersection Observer)
 */
function initIntersectionAnimations() {
  // Vérifier la prise en charge de l'API Intersection Observer
  if ('IntersectionObserver' in window) {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Désinscrire après l'animation
          if (entry.target.classList.contains('once')) {
            observer.unobserve(entry.target);
          }
        } else {
          // Optionnel: réinitialiser l'animation lorsque l'élément n'est plus visible
          if (!entry.target.classList.contains('once')) {
            entry.target.classList.remove('visible');
          }
        }
      });
    }, {
      threshold: 0.15, // Déclencher quand 15% de l'élément est visible
      rootMargin: '0px 0px -100px 0px' // Décaler le déclenchement
    });
    
    // Observer chaque élément
    fadeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback pour navigateurs plus anciens
    document.querySelectorAll('.fade-in').forEach(element => {
      element.classList.add('visible');
    });
  }
}

/**
 * Création d'un effet de particules en arrière-plan
 */
function createParticles() {
  const container = document.querySelector('.welcome-container');
  
  if (!container) return;
  
  // Créer des particules animées
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Taille aléatoire
    const size = Math.random() * 50 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position aléatoire
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;
    
    // Couleur aléatoire
    const hue = Math.random() * 60 - 30 + 220; // Variation autour du bleu primaire
    const saturation = Math.random() * 20 + 60;
    const opacity = Math.random() * 0.15 + 0.05;
    particle.style.backgroundColor = `hsla(${hue}, ${saturation}%, 70%, ${opacity})`;
    
    // Animation personnalisée
    const animDuration = (Math.random() * 20 + 15).toFixed(2);
    const animDelay = (Math.random() * 5).toFixed(2);
    
    particle.style.animation = `move-random ${animDuration}s linear infinite ${animDelay}s`;
    
    container.appendChild(particle);
  }
}

/**
 * Gestion du menu mobile
 */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileMenuBtn || !navMenu) return;
  
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Changer l'icône du bouton (supposant l'utilisation de classes Font Awesome ou similaires)
    if (mobileMenuBtn.classList.contains('fa-bars')) {
      mobileMenuBtn.classList.remove('fa-bars');
      mobileMenuBtn.classList.add('fa-times');
    } else {
      mobileMenuBtn.classList.remove('fa-times');
      mobileMenuBtn.classList.add('fa-bars');
    }
  });
  
  // Fermer le menu lors du clic sur un lien
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      
      if (mobileMenuBtn.classList.contains('fa-times')) {
        mobileMenuBtn.classList.remove('fa-times');
        mobileMenuBtn.classList.add('fa-bars');
      }
    });
  });
}

/**
 * Initialisation des cartes avec effet 3D
 */
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      // Calculer la position relative de la souris dans la carte
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convertir en pourcentage par rapport au centre
      const xPercent = ((x / rect.width) - 0.5) * 2;
      const yPercent = ((y / rect.height) - 0.5) * 2;
      
      // Limiter la rotation
      const maxRotation = 10;
      const xRotation = -yPercent * maxRotation; // Inverser pour effet naturel
      const yRotation = xPercent * maxRotation;
      
      // Appliquer la transformation
      card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
      
      // Effet de lueur dynamique
      const inner = card.querySelector('.card-3d-inner');
      if (inner) {
        inner.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`;
      }
    });
    
    // Réinitialiser lors de la sortie de la souris
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      
      const inner = card.querySelector('.card-3d-inner');
      if (inner) {
        inner.style.background = 'none';
      }
    });
  });
}

/**
 * Initialisation des accordéons
 */
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion-header');
  
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.parentElement;
      const isActive = accordion.classList.contains('active');
      
      // Fermer tous les autres accordéons
      document.querySelectorAll('.accordion').forEach(item => {
        if (item !== accordion) {
          item.classList.remove('active');
        }
      });
      
      // Basculer l'état de l'accordéon actuel
      accordion.classList.toggle('active', !isActive);
    });
  });
}

/**
 * Initialisation des compteurs animés
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  // Fonction pour animer un compteur
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = parseInt(counter.getAttribute('data-duration') || '2000');
    const increment = target / (duration / 16); // 60 FPS
    
    let current = 0;
    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };
    
    updateCounter();
  };
  
  // Observer pour déclencher l'animation lors du défilement
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  } else {
    // Fallback
    counters.forEach(counter => {
      animateCounter(counter);
    });
  }
}

/**
 * Initialisation du carrousel
 */
function initCarousel() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    if (!inner || items.length === 0) return;
    
    let currentIndex = 0;
    const itemCount = items.length;
    
    // Configurer les points de navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
    });
    
    // Fonction pour aller à une diapositive spécifique
    const goToSlide = (index) => {
      currentIndex = index;
      inner.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Mettre à jour les points
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };
    
    // Défilement automatique
    let autoplayInterval;
    
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % itemCount;
        goToSlide(currentIndex);
      }, 5000); // 5 secondes par diapositive
    };
    
    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };
    
    // Démarrer le défilement automatique
    startAutoplay();
    
    // Arrêter l'autoplay lors du survol
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', startAutoplay);
  });
}

/**
 * Initialisation des info-bulles (tooltips)
 */
function initTooltips() {
  // Les tooltips sont gérés en CSS, mais on peut ajouter des comportements supplémentaires ici
  const tooltips = document.querySelectorAll('.tooltip');
  
  tooltips.forEach(tooltip => {
    // Positionnement dynamique pour éviter le débordement
    const tooltipText = tooltip.querySelector('.tooltip-text');
    
    if (!tooltipText) return;
    
    tooltip.addEventListener('mouseenter', () => {
      const rect = tooltipText.getBoundingClientRect();
      
      // Vérifier si l'info-bulle dépasse du bord de la fenêtre
      if (rect.right > window.innerWidth) {
        tooltipText.style.left = 'auto';
        tooltipText.style.right = '0';
        tooltipText.style.transform = 'translateX(0)';
      }
      
      if (rect.left < 0) {
        tooltipText.style.left = '0';
        tooltipText.style.right = 'auto';
        tooltipText.style.transform = 'translateX(0)';
      }
    });
  });
}

/**
 * Gestion du thème (clair/sombre)
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (!themeToggle) return;
  
  const prefersColorSchemeDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  // Appliquer le thème sauvegardé ou la préférence du système
  if (savedTheme === 'dark' || (!savedTheme && prefersColorSchemeDark)) {
    document.documentElement.classList.add('dark-theme');
    themeToggle.checked = true;
  }
  
  // Changer le thème
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });
}

/**
 * Configuration du bouton Explorer
 */
document.addEventListener('DOMContentLoaded', () => {
  const exploreBtn = document.querySelector('.explore-btn');
  
  if (!exploreBtn) return;
  
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Effet visuel avancé
    exploreBtn.classList.add('clicked');
    
    // Créer un effet d'onde (ripple)
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = exploreBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    exploreBtn.appendChild(ripple);
    
    // Changer le texte avec transition
    setTimeout(() => {
      exploreBtn.querySelector('.btn-text').textContent = 'Chargement...';
      
      // Ajouter un indicateur de chargement
      const loader = document.createElement('span');
      loader.classList.add('btn-loader');
      exploreBtn.appendChild(loader);
    }, 200);
    
    // Réinitialiser après animation
    setTimeout(() => {
      exploreBtn.querySelector('.btn-text').textContent = 'Explorer';
      exploreBtn.classList.remove('clicked');
      
      // Supprimer les éléments temporaires
      const ripples = exploreBtn.querySelectorAll('.ripple-effect');
      const loaders = exploreBtn.querySelectorAll('.btn-loader');
      
      ripples.forEach(r => r.remove());
      loaders.forEach(l => l.remove());
      
      // Afficher un message de développement
      const message = document.createElement('div');
      message.classList.add('notification', 'notification-info');
      message.innerHTML = `
        <div class="notification-content">
          <h4>Site en développement</h4>
          <p>D'autres pages seront bientôt disponibles !</p>
          <button class="notification-close">×</button>
        </div>
      `;
      
      document.body.appendChild(message);
      
      // Animation d'entrée
      setTimeout(() => {
        message.classList.add('visible');
      }, 100);
      
      // Configurer le bouton de fermeture
      const closeBtn = message.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        message.classList.remove('visible');
        
        // Supprimer après l'animation
        setTimeout(() => {
          message.remove();
        }, 300);
      });
      
      // Fermeture automatique
      setTimeout(() => {
        message.classList.remove('visible');
        setTimeout(() => {
          message.remove();
        }, 300);
      }, 5000);
    }, 2000);
  });
});
