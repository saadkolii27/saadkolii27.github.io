// Ce script doit être inclus dans signup.html pour capturer les inscriptions
function captureSignup(userData) {
    try {
        // Récupérer les utilisateurs existants ou initialiser un tableau vide
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Ajouter le nouvel utilisateur
        users.push(userData);
        
        // Sauvegarder la liste mise à jour
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('Utilisateur enregistré pour approbation:', userData);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        return false;
    }
}
