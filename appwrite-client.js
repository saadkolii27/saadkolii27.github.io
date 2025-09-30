// appwrite-client.js
// Client Appwrite pour gérer les opérations de lecture/écriture

class AppwriteClient {
    constructor() {
        // Configuration par défaut
        this.config = {
            endpoint: 'https://nyc.cloud.appwrite.io/v1',
            projectId: '68d6cf15003d05dbd780',
            databaseId: '68dc0e1200369423c9a5',
            collectionId: '68dc0ef80001e625476f'
        };

        // Chargement de la configuration depuis localStorage
        this.loadConfig();

        // Initialisation du client Appwrite
        this.client = new Appwrite.Client();
        this.client
            .setEndpoint(this.config.endpoint)
            .setProject(this.config.projectId);
            
        // Créer les instances des services
        this.databases = new Appwrite.Databases(this.client);
        this.account = new Appwrite.Account(this.client);
    }

    // Chargement de la configuration depuis localStorage
    loadConfig() {
        const savedConfig = localStorage.getItem('appwrite-config');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            this.config.databaseId = config.databaseId;
            this.config.collectionId = config.collectionId;
        }
    }

    // Sauvegarde de la configuration dans localStorage
    saveConfig(databaseId, collectionId) {
        this.config.databaseId = databaseId;
        this.config.collectionId = collectionId;

        localStorage.setItem('appwrite-config', JSON.stringify({
            databaseId,
            collectionId
        }));
    }

    // Mise à jour du projet
    setProject(projectId) {
        this.config.projectId = projectId;
        this.client.setProject(projectId);
    }

    // Vérification de la configuration
    isConfigured() {
        return Boolean(this.config.databaseId && this.config.collectionId);
    }
    
    // Créer une session anonyme
    async createAnonymousSession() {
        try {
            // Vérifier d'abord si nous avons déjà une session active
            try {
                await this.account.get();
                console.log("Session utilisateur déjà active");
                return true;
            } catch (error) {
                // Pas de session active, créons-en une anonyme
                console.log("Création d'une nouvelle session anonyme");
                await this.account.createAnonymousSession();
                return true;
            }
        } catch (error) {
            console.error("Erreur lors de la création de la session anonyme:", error);
            return false;
        }
    }

    // Création d'un document
    async createDocument(data) {
        if (!this.isConfigured()) {
            throw new Error('La base de données et la collection ne sont pas configurées');
        }
        
        // Créer une session anonyme avant d'accéder aux données
        await this.createAnonymousSession();

        return await this.databases.createDocument(
            this.config.databaseId,
            this.config.collectionId,
            ID.unique(),
            data
        );
    }

    // Récupération de tous les documents
    async listDocuments() {
        if (!this.isConfigured()) {
            throw new Error('La base de données et la collection ne sont pas configurées');
        }
        
        // Créer une session anonyme avant d'accéder aux données
        await this.createAnonymousSession();

        return await this.databases.listDocuments(
            this.config.databaseId,
            this.config.collectionId
        );
    }

    // Récupération d'un document spécifique
    async getDocument(documentId) {
        if (!this.isConfigured()) {
            throw new Error('La base de données et la collection ne sont pas configurées');
        }
        
        // Créer une session anonyme avant d'accéder aux données
        await this.createAnonymousSession();

        return await this.databases.getDocument(
            this.config.databaseId,
            this.config.collectionId,
            documentId
        );
    }

    // Mise à jour d'un document
    async updateDocument(documentId, data) {
        if (!this.isConfigured()) {
            throw new Error('La base de données et la collection ne sont pas configurées');
        }
        
        // Créer une session anonyme avant d'accéder aux données
        await this.createAnonymousSession();

        return await this.databases.updateDocument(
            this.config.databaseId,
            this.config.collectionId,
            documentId,
            data
        );
    }

    // Suppression d'un document
    async deleteDocument(documentId) {
        if (!this.isConfigured()) {
            throw new Error('La base de données et la collection ne sont pas configurées');
        }
        
        // Créer une session anonyme avant d'accéder aux données
        await this.createAnonymousSession();

        return await this.databases.deleteDocument(
            this.config.databaseId,
            this.config.collectionId,
            documentId
        );
    }
}