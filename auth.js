// auth.js
// Gestionnaire d'authentification pour Appwrite

class Auth {
    constructor() {
        // Initialisation du client Appwrite
        this.client = new Appwrite.Client();
        this.client
            .setEndpoint('https://nyc.cloud.appwrite.io/v1')
            .setProject('68d6cf15003d05dbd780');
            
        // Initialisation des services Appwrite
        this.account = new Appwrite.Account(this.client);
        this.user = null;
    }

    // Vérifier si un utilisateur est connecté
    async isLoggedIn() {
        try {
            this.user = await this.account.get();
            return true;
        } catch (error) {
            this.user = null;
            return false;
        }
    }

    // Récupérer l'utilisateur actuel
    async getCurrentUser() {
        if (!this.user) {
            try {
                this.user = await this.account.get();
            } catch (error) {
                return null;
            }
        }
        return this.user;
    }

    // Création d'un nouveau compte
    async createAccount(email, password, name) {
        try {
            await this.account.create('unique()', email, password, name);
            // Connexion automatique après la création du compte
            return await this.login(email, password);
        } catch (error) {
            throw new Error(`Erreur lors de la création du compte: ${error.message}`);
        }
    }

    // Connexion à un compte existant
    async login(email, password) {
        try {
            await this.account.createEmailSession(email, password);
            this.user = await this.account.get();
            return this.user;
        } catch (error) {
            throw new Error(`Erreur lors de la connexion: ${error.message}`);
        }
    }

    // Déconnexion
    async logout() {
        try {
            await this.account.deleteSession('current');
            this.user = null;
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
        }
    }

    // Mise à jour du nom d'utilisateur
    async updateName(name) {
        try {
            await this.account.updateName(name);
            this.user = await this.account.get();
            return this.user;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du nom: ${error.message}`);
        }
    }

    // Mise à jour du mot de passe
    async updatePassword(password, oldPassword) {
        try {
            await this.account.updatePassword(password, oldPassword);
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
        }
    }

    // Récupération de mot de passe
    async recoverPassword(email) {
        try {
            await this.account.createRecovery(email, 'https://ssaad.me/reset-password');
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du mot de passe: ${error.message}`);
        }
    }

    // Redirection basée sur l'état de connexion
    async redirectIfNeeded(loginPage, homePage) {
        const isLoggedIn = await this.isLoggedIn();
        const currentPath = window.location.pathname;

        // Si on est sur la page de connexion mais déjà connecté
        if (currentPath.includes(loginPage) && isLoggedIn) {
            window.location.href = homePage;
            return true;
        }
        
        // Si on n'est pas sur la page de connexion et pas connecté
        if (!currentPath.includes(loginPage) && !isLoggedIn) {
            window.location.href = loginPage;
            return true;
        }

        return false;
    }
}

// Exporter une instance unique
const auth = new Auth();