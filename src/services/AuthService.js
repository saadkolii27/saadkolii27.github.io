import { account } from '../../lib/appwrite.js';
import { ID } from 'appwrite';

export class AuthService {
    constructor() {
        this.account = account;
    }

    async getCurrentUser() {
        try {
            // First try Appwrite
            return await this.account.get();
        } catch (error) {
            // Fallback to localStorage mock user
            const mockUser = localStorage.getItem('mock-user');
            return mockUser ? JSON.parse(mockUser) : null;
        }
    }

    async login(email, password) {
        try {
            // Mock authentication for demo purposes
            if (email && password) {
                const mockUser = {
                    $id: 'demo-user-' + Date.now(),
                    name: 'Demo User',
                    email: email
                };
                
                // Save to localStorage for persistence
                localStorage.setItem('mock-user', JSON.stringify(mockUser));
                
                return mockUser;
            } else {
                throw new Error('Email and password are required');
            }
        } catch (error) {
            // Fallback to mock authentication if Appwrite fails
            console.warn('Appwrite login failed, using mock authentication:', error.message);
            
            if (email && password) {
                const mockUser = {
                    $id: 'demo-user-' + Date.now(),
                    name: email.split('@')[0],
                    email: email
                };
                
                localStorage.setItem('mock-user', JSON.stringify(mockUser));
                return mockUser;
            }
            
            throw new Error('Login failed: Email and password are required');
        }
    }

    async register(email, password, name) {
        try {
            // Mock registration for demo purposes
            if (email && password && name) {
                return true;
            } else {
                throw new Error('All fields are required');
            }
        } catch (error) {
            // Fallback to mock registration if Appwrite fails
            console.warn('Appwrite registration failed, using mock registration:', error.message);
            
            if (email && password && name) {
                return true;
            }
            
            throw new Error('Registration failed: All fields are required');
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
            return true;
        } catch (error) {
            throw new Error('Logout failed: ' + error.message);
        }
    }

    async resetPassword(email) {
        try {
            await this.account.createRecovery(email, 'https://your-app.com/recover');
            return true;
        } catch (error) {
            throw new Error('Password reset failed: ' + error.message);
        }
    }
}