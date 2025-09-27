export class UIManager {
    constructor(app) {
        this.app = app;
        this.currentView = 'events';
        this.components = {};
    }

    async init() {
        this.setupNavigation();
        this.setupEventListeners();
        await this.loadInitialView();
        this.app.cartService.loadFromLocalStorage();
        this.updateCartCounter();
        
        // Subscribe to cart changes
        this.app.cartService.subscribe(() => {
            this.updateCartCounter();
        });
    }

    setupNavigation() {
        const nav = document.querySelector('header');
        nav.innerHTML = `
            <div class="flex justify-between items-center w-full px-6">
                <div class="flex items-center">
                    <img src="https://tickets.cafonline.com/cf_error_pages/assets/img/logo.svg" alt="CAF Logo" class="h-16">
                    <span class="ml-4 text-xl font-bold text-white">CAF Tickets</span>
                </div>
                <nav class="flex items-center space-x-6">
                    <a href="#events" class="nav-link text-white hover:text-green-400 transition-colors">Events</a>
                    <div class="relative">
                        <a href="#cart" class="nav-link text-white hover:text-green-400 transition-colors flex items-center">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 002 2.32h9.36a2 2 0 002-2.32L17 13"></path>
                            </svg>
                            Cart <span id="cart-counter" class="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hidden">0</span>
                        </a>
                    </div>
                    <div id="auth-section">
                        ${this.app.currentUser ? this.getLoggedInNav() : this.getLoggedOutNav()}
                    </div>
                </nav>
            </div>
        `;
    }

    getLoggedInNav() {
        return `
            <div class="flex items-center space-x-4">
                <span class="text-white">Welcome, ${this.app.currentUser.name}</span>
                <a href="#my-tickets" class="nav-link text-white hover:text-green-400 transition-colors">My Tickets</a>
                <button id="logout-btn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">Logout</button>
            </div>
        `;
    }

    getLoggedOutNav() {
        return `
            <div class="flex items-center space-x-4">
                <button id="login-btn" class="text-white hover:text-green-400 transition-colors">Login</button>
                <button id="register-btn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">Sign Up</button>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const view = e.target.getAttribute('href').substring(1);
                this.navigateToView(view);
            }

            if (e.target.matches('#login-btn')) {
                this.showLoginModal();
            }

            if (e.target.matches('#register-btn')) {
                this.showRegisterModal();
            }

            if (e.target.matches('#logout-btn')) {
                this.app.logout();
            }
        });

        // Handle form submissions
        document.addEventListener('submit', async (e) => {
            if (e.target.matches('#login-form')) {
                e.preventDefault();
                await this.handleLogin(e.target);
            }

            if (e.target.matches('#register-form')) {
                e.preventDefault();
                await this.handleRegister(e.target);
            }

            if (e.target.matches('#checkout-form')) {
                e.preventDefault();
                await this.handleCheckout(e.target);
            }
        });
    }

    async loadInitialView() {
        const main = document.querySelector('main');
        main.className = 'container mx-auto px-6 py-8';
        main.innerHTML = '<div id="app-content"></div>';
        
        await this.navigateToView('events');
    }

    async navigateToView(view) {
        this.currentView = view;
        const content = document.getElementById('app-content');
        
        switch (view) {
            case 'events':
                content.innerHTML = await this.getEventsView();
                break;
            case 'cart':
                content.innerHTML = await this.getCartView();
                break;
            case 'my-tickets':
                if (this.app.isLoggedIn()) {
                    content.innerHTML = await this.getMyTicketsView();
                } else {
                    this.showLoginModal();
                }
                break;
            default:
                content.innerHTML = await this.getEventsView();
        }
    }

    async getEventsView() {
        const events = await this.app.eventService.getAllEvents();
        return `
            <div class="events-view">
                <h1 class="text-4xl font-bold text-center mb-8 text-green-400">Upcoming Events</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${events.map(event => this.getEventCard(event)).join('')}
                </div>
            </div>
        `;
    }

    getEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="${event.image || 'https://via.placeholder.com/400x200'}" alt="${event.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${event.title}</h3>
                    <p class="text-gray-600 mb-4">${event.description}</p>
                    <div class="text-sm text-gray-500 mb-4">
                        <p><i class="fas fa-map-marker-alt"></i> ${event.venue}, ${event.city}</p>
                        <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                        <p><i class="fas fa-clock"></i> ${formattedTime}</p>
                    </div>
                    <div class="space-y-2">
                        ${event.ticketPrices.map(ticket => `
                            <div class="flex justify-between items-center">
                                <span class="font-medium">${ticket.category}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-green-600 font-bold">$${ticket.price}</span>
                                    <button onclick="window.uiManager.addToCart('${event.$id}', '${ticket.category}', ${ticket.price}, '${event.title}', '${event.venue}', '${event.date}')" 
                                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    async getCartView() {
        const items = this.app.cartService.getItems();
        if (items.length === 0) {
            return `
                <div class="text-center py-16">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p class="text-gray-600 mb-8">Add some tickets to get started!</p>
                    <button onclick="window.uiManager.navigateToView('events')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Browse Events
                    </button>
                </div>
            `;
        }

        const total = this.app.cartService.getTotalPrice();
        
        return `
            <div class="cart-view max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h2>
                <div class="space-y-4 mb-8">
                    ${items.map(item => `
                        <div class="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">${item.eventTitle}</h3>
                                <p class="text-gray-600">${item.category} - ${item.venue}</p>
                                <p class="text-sm text-gray-500">${new Date(item.date).toLocaleDateString()}</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center space-x-2">
                                    <button onclick="window.uiManager.updateCartQuantity('${item.id}', ${item.quantity - 1})" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">-</button>
                                    <span class="font-medium">${item.quantity}</span>
                                    <button onclick="window.uiManager.updateCartQuantity('${item.id}', ${item.quantity + 1})" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">+</button>
                                </div>
                                <span class="text-lg font-bold text-green-600">$${(item.price * item.quantity).toFixed(2)}</span>
                                <button onclick="window.uiManager.removeFromCart('${item.id}')" class="text-red-600 hover:text-red-800">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex justify-between items-center text-xl font-bold mb-4">
                        <span>Total: $${total.toFixed(2)}</span>
                    </div>
                    <button onclick="window.uiManager.proceedToCheckout()" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    }

    async getMyTicketsView() {
        // Mock user tickets for now
        return `
            <div class="my-tickets-view">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">My Tickets</h2>
                <p class="text-gray-600">Your purchased tickets will appear here.</p>
            </div>
        `;
    }

    addToCart(eventId, category, price, eventTitle, venue, date) {
        this.app.cartService.addItem({
            eventId,
            category,
            price,
            eventTitle,
            venue,
            date,
            quantity: 1
        });
        this.showSuccessMessage('Ticket added to cart!');
    }

    removeFromCart(itemId) {
        this.app.cartService.removeItem(itemId);
        this.navigateToView('cart'); // Refresh cart view
    }

    updateCartQuantity(itemId, quantity) {
        this.app.cartService.updateQuantity(itemId, quantity);
        this.navigateToView('cart'); // Refresh cart view
    }

    updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        const totalItems = this.app.cartService.getTotalItems();
        
        if (totalItems > 0) {
            counter.textContent = totalItems;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }

    proceedToCheckout() {
        if (!this.app.isLoggedIn()) {
            this.showLoginModal();
            return;
        }
        
        this.showCheckoutModal();
    }

    showCheckoutModal() {
        const modal = this.createModal('Checkout', this.getCheckoutContent());
        document.body.appendChild(modal);
    }

    getCheckoutContent() {
        const items = this.app.cartService.getItems();
        const total = this.app.cartService.getTotalPrice();
        
        return `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Order Summary</h3>
                    <div class="space-y-2 mb-4">
                        ${items.map(item => `
                            <div class="flex justify-between">
                                <span>${item.eventTitle} - ${item.category} (x${item.quantity})</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="border-t pt-2 font-bold">
                        <div class="flex justify-between">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Payment Information</h3>
                    <form id="checkout-form" class="space-y-4">
                        <input type="text" name="cardNumber" placeholder="Card Number" class="w-full border border-gray-300 rounded px-3 py-2" required>
                        <div class="flex space-x-4">
                            <input type="text" name="expiryDate" placeholder="MM/YY" class="flex-1 border border-gray-300 rounded px-3 py-2" required>
                            <input type="text" name="cvv" placeholder="CVV" class="flex-1 border border-gray-300 rounded px-3 py-2" required>
                        </div>
                        <input type="text" name="cardholderName" placeholder="Cardholder Name" class="w-full border border-gray-300 rounded px-3 py-2" required>
                        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                            Complete Purchase
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    showLoginModal() {
        const modal = this.createModal('Login', `
            <form id="login-form" class="space-y-4">
                <input type="email" name="email" placeholder="Email" class="w-full border border-gray-300 rounded px-3 py-2" required>
                <input type="password" name="password" placeholder="Password" class="w-full border border-gray-300 rounded px-3 py-2" required>
                <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors">Login</button>
                <p class="text-center text-sm text-gray-600">
                    Don't have an account? 
                    <button type="button" onclick="this.closest('.modal').remove(); window.uiManager.showRegisterModal();" class="text-green-600 hover:text-green-700">Sign up</button>
                </p>
            </form>
        `);
        document.body.appendChild(modal);
    }

    showRegisterModal() {
        const modal = this.createModal('Create Account', `
            <form id="register-form" class="space-y-4">
                <input type="text" name="name" placeholder="Full Name" class="w-full border border-gray-300 rounded px-3 py-2" required>
                <input type="email" name="email" placeholder="Email" class="w-full border border-gray-300 rounded px-3 py-2" required>
                <input type="password" name="password" placeholder="Password" class="w-full border border-gray-300 rounded px-3 py-2" required>
                <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors">Create Account</button>
                <p class="text-center text-sm text-gray-600">
                    Already have an account? 
                    <button type="button" onclick="this.closest('.modal').remove(); window.uiManager.showLoginModal();" class="text-green-600 hover:text-green-700">Login</button>
                </p>
            </form>
        `);
        document.body.appendChild(modal);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full m-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">${title}</h2>
                    <button onclick="this.closest('.modal').remove()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                ${content}
            </div>
        `;
        return modal;
    }

    updateUserState(user) {
        this.app.currentUser = user;
        this.setupNavigation();
    }

    displayEvents(events) {
        if (this.currentView === 'events') {
            this.navigateToView('events');
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500' : 
            type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        } text-white`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        const password = formData.get('password') || form.querySelector('input[type="password"]').value;

        try {
            await this.app.login(email, password);
            form.closest('.modal').remove();
            this.showSuccessMessage('Login successful!');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || form.querySelector('input[type="text"]').value;
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        const password = formData.get('password') || form.querySelector('input[type="password"]').value;

        try {
            await this.app.register(email, password, name);
            form.closest('.modal').remove();
            this.showSuccessMessage('Registration successful! You are now logged in.');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleCheckout(form) {
        const formData = new FormData(form);
        const cardNumber = formData.get('cardNumber') || form.querySelector('input[placeholder="Card Number"]').value;
        const expiryDate = formData.get('expiryDate') || form.querySelector('input[placeholder="MM/YY"]').value;
        const cvv = formData.get('cvv') || form.querySelector('input[placeholder="CVV"]').value;
        const cardholderName = formData.get('cardholderName') || form.querySelector('input[placeholder="Cardholder Name"]').value;

        try {
            const cartItems = this.app.cartService.getItems();
            const userInfo = {
                userId: this.app.currentUser.$id,
                email: this.app.currentUser.email,
                name: this.app.currentUser.name
            };
            const paymentInfo = {
                method: 'credit_card',
                cardNumber,
                expiryDate,
                cvv,
                cardholderName
            };

            const result = await this.app.ticketService.purchaseTickets(cartItems, userInfo, paymentInfo);
            
            if (result.success) {
                this.app.cartService.clearCart();
                form.closest('.modal').remove();
                this.showPurchaseConfirmation(result);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showPurchaseConfirmation(result) {
        const modal = this.createModal('Purchase Confirmed!', `
            <div class="text-center space-y-4">
                <div class="text-green-600">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold">Your tickets have been purchased successfully!</h3>
                <p class="text-gray-600">You will receive an email confirmation with your tickets shortly.</p>
                <p class="text-sm text-gray-500">Total: $${result.order.totalAmount.toFixed(2)}</p>
                <button onclick="this.closest('.modal').remove(); window.uiManager.navigateToView('my-tickets');" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors">
                    View My Tickets
                </button>
            </div>
        `);
        document.body.appendChild(modal);
    }
}