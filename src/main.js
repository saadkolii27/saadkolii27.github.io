import { client, account } from '../lib/appwrite.js';

// Exemple de connexion anonyme à Appwrite et affichage dans la console
async function connectAppwrite() {
  try {
    // Vérifie si une session existe déjà
    const session = await account.getSession('current');
    console.log('Session existante :', session);
    document.getElementById('app').innerHTML = `<div class='p-8 text-center'><h2 class='text-2xl font-bold mb-4'>Bienvenue !</h2><p>Vous êtes connecté à Appwrite.</p></div>`;
  } catch (e) {
    // Si aucune session, crée une session anonyme
    try {
      const anonSession = await account.createAnonymousSession();
      console.log('Session anonyme créée :', anonSession);
      document.getElementById('app').innerHTML = `<div class='p-8 text-center'><h2 class='text-2xl font-bold mb-4'>Bienvenue !</h2><p>Session anonyme créée avec succès.</p></div>`;
    } catch (err) {
      console.error('Erreur de connexion Appwrite :', err);
      document.getElementById('app').innerHTML = `<div class='p-8 text-center text-red-600'><h2 class='text-2xl font-bold mb-4'>Erreur</h2><p>Impossible de se connecter à Appwrite.</p></div>`;
    }
  }
}

connectAppwrite();
