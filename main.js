// Animations et interactions JavaScript

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Animation supplémentaire pour le titre
    animateWelcomeElements();
    
    // Effet de parallaxe sur le conteneur de bienvenue
    setupParallaxEffect();
    
    // Ajouter un gestionnaire d'événement pour le bouton Explorer
    setupExploreButton();
});

// Animer les éléments de bienvenue avec un délai
function animateWelcomeElements() {
    const welcomeContainer = document.querySelector('.welcome-container');
    
    // Effet de pulsation légère
    setTimeout(() => {
        welcomeContainer.classList.add('pulse');
    }, 2000);
}

// Configurer l'effet de parallaxe
function setupParallaxEffect() {
    const welcomeContainer = document.querySelector('.welcome-container');
    
    document.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
        
        welcomeContainer.style.transform = `translateY(-5px) rotateX(${yPos * 0.2}deg) rotateY(${xPos * -0.2}deg)`;
    });
    
    // Réinitialiser la transformation lorsque la souris quitte la fenêtre
    document.addEventListener('mouseleave', () => {
        welcomeContainer.style.transform = 'translateY(-5px)';
    });
}

// Configuration du bouton Explorer
function setupExploreButton() {
    const exploreBtn = document.querySelector('.explore-btn');
    
    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Effet de clic
        exploreBtn.classList.add('clicked');
        
        // Simuler le chargement d'une nouvelle page (pour démonstration)
        setTimeout(() => {
            exploreBtn.textContent = 'Chargement...';
        }, 200);
        
        // Réinitialiser après un certain temps (pour démonstration)
        setTimeout(() => {
            exploreBtn.textContent = 'Explorer';
            exploreBtn.classList.remove('clicked');
            
            // Ici, vous pourriez ajouter une redirection vers une autre page
            // window.location.href = 'portfolio.html';
            
            // Pour l'instant, affichons simplement une alerte
            alert('Le site est en cours de développement. D\'autres pages seront bientôt disponibles !');
        }, 2000);
    });
}
