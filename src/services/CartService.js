export class CartService {
    constructor() {
        this.items = [];
        this.listeners = [];
    }

    addItem(ticket) {
        const existingItem = this.items.find(item => 
            item.eventId === ticket.eventId && item.category === ticket.category
        );

        if (existingItem) {
            existingItem.quantity += ticket.quantity;
        } else {
            this.items.push({
                id: Date.now().toString(),
                eventId: ticket.eventId,
                eventTitle: ticket.eventTitle,
                category: ticket.category,
                price: ticket.price,
                quantity: ticket.quantity,
                venue: ticket.venue,
                date: ticket.date
            });
        }

        this.saveToLocalStorage();
        this.notifyListeners();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.saveToLocalStorage();
                this.notifyListeners();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    getItems() {
        return [...this.items];
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    isEmpty() {
        return this.items.length === 0;
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.getItems()));
    }

    saveToLocalStorage() {
        localStorage.setItem('ticketing-cart', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('ticketing-cart');
            if (saved) {
                this.items = JSON.parse(saved);
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }
}