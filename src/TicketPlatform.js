import { AuthService } from './services/AuthService.js';
import { EventService } from './services/EventService.js';
import { TicketService } from './services/TicketService.js';
import { CartService } from './services/CartService.js';
import { UIManager } from './ui/UIManager.js';

export class TicketPlatform {
    constructor() {
        this.authService = new AuthService();
        this.eventService = new EventService();
        this.ticketService = new TicketService();
        this.cartService = new CartService();
        this.uiManager = new UIManager(this);
        this.currentUser = null;
    }

    async init() {
        try {
            // Check if user is already logged in
            this.currentUser = await this.authService.getCurrentUser();
            
            // Initialize UI
            await this.uiManager.init();
            
            // Load initial data
            await this.loadInitialData();
            
            console.log('Ticket Platform initialized successfully');
        } catch (error) {
            console.error('Error initializing platform:', error);
            this.uiManager.showError('Failed to initialize platform');
        }
    }

    async loadInitialData() {
        try {
            const events = await this.eventService.getAllEvents();
            this.uiManager.displayEvents(events);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    async login(email, password) {
        try {
            this.currentUser = await this.authService.login(email, password);
            this.uiManager.updateUserState(this.currentUser);
            return this.currentUser;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async register(email, password, name) {
        try {
            await this.authService.register(email, password, name);
            return await this.login(email, password);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.authService.logout();
            this.currentUser = null;
            this.cartService.clearCart();
            this.uiManager.updateUserState(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}