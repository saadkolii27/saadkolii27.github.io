import { databases } from '../../lib/appwrite.js';
import { ID } from 'appwrite';

export class TicketService {
    constructor() {
        this.databases = databases;
        this.databaseId = 'ticketing-platform';
        this.ticketCollectionId = 'tickets';
        this.orderCollectionId = 'orders';
    }

    async purchaseTickets(cartItems, userInfo, paymentInfo) {
        try {
            // Create order
            const order = {
                userId: userInfo.userId,
                userEmail: userInfo.email,
                userName: userInfo.name,
                items: cartItems,
                totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
                status: 'pending',
                paymentMethod: paymentInfo.method,
                createdAt: new Date().toISOString()
            };

            // In a real implementation, you would integrate with a payment processor here
            await this.processPayment(paymentInfo, order.totalAmount);

            // Create tickets for each item
            const tickets = [];
            for (const item of cartItems) {
                for (let i = 0; i < item.quantity; i++) {
                    const ticket = await this.createTicket({
                        eventId: item.eventId,
                        eventTitle: item.eventTitle,
                        category: item.category,
                        price: item.price,
                        venue: item.venue,
                        date: item.date,
                        userId: userInfo.userId,
                        userEmail: userInfo.email,
                        userName: userInfo.name,
                        qrCode: this.generateQRCode(),
                        ticketNumber: this.generateTicketNumber(),
                        status: 'valid'
                    });
                    tickets.push(ticket);
                }
            }

            order.tickets = tickets;
            order.status = 'completed';

            // Save order (in production, you'd save to database)
            console.log('Order created:', order);

            return { success: true, order, tickets };
        } catch (error) {
            throw new Error('Purchase failed: ' + error.message);
        }
    }

    async createTicket(ticketData) {
        try {
            // In production, save to Appwrite database
            const ticket = {
                ...ticketData,
                $id: ID.unique(),
                createdAt: new Date().toISOString()
            };

            console.log('Ticket created:', ticket);
            return ticket;
        } catch (error) {
            throw new Error('Failed to create ticket: ' + error.message);
        }
    }

    async getUserTickets(userId) {
        try {
            // In production, fetch from database
            // For now, return mock data or from localStorage
            const savedTickets = localStorage.getItem(`user-tickets-${userId}`);
            return savedTickets ? JSON.parse(savedTickets) : [];
        } catch (error) {
            throw new Error('Failed to fetch user tickets: ' + error.message);
        }
    }

    async validateTicket(ticketId, qrCode) {
        try {
            // In production, validate against database
            return { valid: true, message: 'Ticket is valid' };
        } catch (error) {
            throw new Error('Ticket validation failed: ' + error.message);
        }
    }

    generateQRCode() {
        // In production, use a proper QR code library
        return 'QR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    generateTicketNumber() {
        const prefix = 'CAF';
        const number = Math.random().toString().substr(2, 8);
        return `${prefix}-${number}`;
    }

    async processPayment(paymentInfo, amount) {
        // Mock payment processing
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv) {
                    resolve({ success: true, transactionId: 'TXN-' + Date.now() });
                } else {
                    reject(new Error('Invalid payment information'));
                }
            }, 2000);
        });
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
}