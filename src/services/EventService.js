import { databases } from '../../lib/appwrite.js';
import { ID, Query } from 'appwrite';

export class EventService {
    constructor() {
        this.databases = databases;
        this.databaseId = 'ticketing-platform';
        this.eventCollectionId = 'events';
    }

    async getAllEvents() {
        try {
            const response = await this.databases.listDocuments(
                this.databaseId,
                this.eventCollectionId,
                [
                    Query.equal('status', 'active'),
                    Query.orderDesc('$createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            // Return mock data for development if database not set up
            console.warn('Database not configured, returning mock data:', error.message);
            return this.getMockEvents();
        }
    }

    async getEventById(eventId) {
        try {
            return await this.databases.getDocument(
                this.databaseId,
                this.eventCollectionId,
                eventId
            );
        } catch (error) {
            // Return mock data for development
            return this.getMockEvents().find(event => event.$id === eventId);
        }
    }

    getMockEvents() {
        return [
            {
                $id: 'event1',
                title: 'TotalEnergies CAF Africa Cup of Nations - Group Stage',
                description: 'Experience the excitement of African football at its finest. Watch the continent\'s best teams compete in the group stage matches.',
                venue: 'Mohammed V Stadium',
                city: 'Casablanca',
                country: 'Morocco',
                date: '2025-06-15T20:00:00.000Z',
                image: 'https://tickets.cafonline.com/cf_error_pages/assets/img/event1.jpg',
                ticketPrices: [
                    { category: 'VIP', price: 150, available: 50 },
                    { category: 'Premium', price: 80, available: 200 },
                    { category: 'Standard', price: 40, available: 500 }
                ],
                status: 'active'
            },
            {
                $id: 'event2',
                title: 'CAF Africa Cup of Nations - Quarter Final',
                description: 'The intensity builds as the top 8 teams battle for a place in the semi-finals.',
                venue: 'Prince Moulay Abdellah Stadium',
                city: 'Rabat',
                country: 'Morocco',
                date: '2025-06-25T19:00:00.000Z',
                image: 'https://tickets.cafonline.com/cf_error_pages/assets/img/event2.jpg',
                ticketPrices: [
                    { category: 'VIP', price: 200, available: 40 },
                    { category: 'Premium', price: 120, available: 150 },
                    { category: 'Standard', price: 60, available: 400 }
                ],
                status: 'active'
            },
            {
                $id: 'event3',
                title: 'CAF Africa Cup of Nations - Final',
                description: 'The pinnacle of African football! Witness history as two teams battle for continental supremacy.',
                venue: 'Mohammed V Stadium',
                city: 'Casablanca',
                country: 'Morocco',
                date: '2025-07-05T20:00:00.000Z',
                image: 'https://tickets.cafonline.com/cf_error_pages/assets/img/event3.jpg',
                ticketPrices: [
                    { category: 'VIP', price: 300, available: 30 },
                    { category: 'Premium', price: 180, available: 100 },
                    { category: 'Standard', price: 90, available: 300 }
                ],
                status: 'active'
            }
        ];
    }

    async createEvent(eventData) {
        try {
            return await this.databases.createDocument(
                this.databaseId,
                this.eventCollectionId,
                ID.unique(),
                eventData
            );
        } catch (error) {
            throw new Error('Failed to create event: ' + error.message);
        }
    }

    async updateEvent(eventId, eventData) {
        try {
            return await this.databases.updateDocument(
                this.databaseId,
                this.eventCollectionId,
                eventId,
                eventData
            );
        } catch (error) {
            throw new Error('Failed to update event: ' + error.message);
        }
    }
}