import { Client, Account, Databases, Functions, Storage } from 'appwrite';

// Appwrite configuration
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d6cf15003d05dbd780');

// Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = 'webmonitor-db';
export const USERS_COLLECTION_ID = 'users';
export const SITES_COLLECTION_ID = 'monitored-sites';
export const NOTIFICATIONS_COLLECTION_ID = 'notifications';

// Appwrite Service Class
export class AppwriteService {
    constructor() {
        this.client = client;
        this.account = account;
        this.databases = databases;
        this.functions = functions;
        this.storage = storage;
    }

    // Authentication methods
    async createAccount(email, password, name) {
        try {
            const user = await this.account.create('unique()', email, password, name);
            console.log('Account created:', user);
            return user;
        } catch (error) {
            console.error('Account creation failed:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const session = await this.account.createEmailSession(email, password);
            console.log('Login successful:', session);
            return session;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    }

    // Database methods for monitored sites
    async createMonitoredSite(siteData) {
        try {
            const document = await this.databases.createDocument(
                DATABASE_ID,
                SITES_COLLECTION_ID,
                'unique()',
                siteData
            );
            console.log('Site created:', document);
            return document;
        } catch (error) {
            console.error('Failed to create site:', error);
            throw error;
        }
    }

    async getMonitoredSites(userId) {
        try {
            const documents = await this.databases.listDocuments(
                DATABASE_ID,
                SITES_COLLECTION_ID,
                [
                    // Filter by user ID
                    `userId="${userId}"`
                ]
            );
            return documents.documents;
        } catch (error) {
            console.error('Failed to get monitored sites:', error);
            throw error;
        }
    }

    async updateMonitoredSite(siteId, updateData) {
        try {
            const document = await this.databases.updateDocument(
                DATABASE_ID,
                SITES_COLLECTION_ID,
                siteId,
                updateData
            );
            return document;
        } catch (error) {
            console.error('Failed to update site:', error);
            throw error;
        }
    }

    async deleteMonitoredSite(siteId) {
        try {
            await this.databases.deleteDocument(
                DATABASE_ID,
                SITES_COLLECTION_ID,
                siteId
            );
            console.log('Site deleted successfully');
        } catch (error) {
            console.error('Failed to delete site:', error);
            throw error;
        }
    }

    // Notification methods
    async createNotification(notificationData) {
        try {
            const document = await this.databases.createDocument(
                DATABASE_ID,
                NOTIFICATIONS_COLLECTION_ID,
                'unique()',
                notificationData
            );
            return document;
        } catch (error) {
            console.error('Failed to create notification:', error);
            throw error;
        }
    }

    async getNotifications(userId) {
        try {
            const documents = await this.databases.listDocuments(
                DATABASE_ID,
                NOTIFICATIONS_COLLECTION_ID,
                [
                    `userId="${userId}"`
                ]
            );
            return documents.documents;
        } catch (error) {
            console.error('Failed to get notifications:', error);
            throw error;
        }
    }

    // Utility method to check connection
    async ping() {
        try {
            const health = await this.functions.list();
            console.log('Appwrite connection successful');
            return true;
        } catch (error) {
            console.error('Appwrite connection failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const appwriteService = new AppwriteService();

// Export client for direct access if needed
export { client };

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
    try {
        await account.get();
        return true;
    } catch {
        return false;
    }
};

export default appwriteService;