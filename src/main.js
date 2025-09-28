import { account } from '../lib/appwrite.js';
import { ID } from 'appwrite';

// Gestion du formulaire d'inscription
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const message = document.getElementById('register-message');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';
      const email = form.email.value;
      const password = form.password.value;
      try {
        await account.create(ID.unique(), email, password);
        message.textContent = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        message.className = 'mt-4 text-center text-green-600 text-sm';
        form.reset();
      } catch (err) {
        message.textContent = err?.message || 'Erreur lors de la création du compte.';
        message.className = 'mt-4 text-center text-red-600 text-sm';
      }
    });
  }
});
