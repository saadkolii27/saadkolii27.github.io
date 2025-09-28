import { account, databases } from '../lib/appwrite.js';
import { ID } from 'appwrite';

// App State Management
class AppState {
    constructor() {
        this.user = null;
        this.isLoading = false;
        this.currentView = 'auth'; // 'auth' or 'dashboard'
    }

    setUser(user) {
        this.user = user;
        this.currentView = user ? 'dashboard' : 'auth';
        this.render();
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        if (this.currentView === 'auth') {
            app.innerHTML = this.renderAuthView();
            this.attachAuthEventListeners();
        } else {
            app.innerHTML = this.renderDashboardView();
            this.attachDashboardEventListeners();
        }
    }

    renderAuthView() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
                        <p class="text-gray-600">Sign in to your account or create a new one</p>
                    </div>

                    <div class="mb-6">
                        <div class="flex bg-gray-100 rounded-lg p-1" id="auth-tabs">
                            <button class="auth-tab active" data-tab="signin">Sign In</button>
                            <button class="auth-tab" data-tab="signup">Sign Up</button>
                        </div>
                    </div>

                    <form id="auth-form" class="space-y-4">
                        <div id="name-field" class="hidden">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" id="name" class="form-input" placeholder="Enter your full name">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="email" class="form-input" placeholder="Enter your email" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="Enter your password" required>
                        </div>

                        <button type="submit" id="auth-submit" class="btn-primary w-full" ${this.isLoading ? 'disabled' : ''}>
                            ${this.isLoading ? 'Processing...' : 'Sign In'}
                        </button>
                    </form>

                    <div id="auth-error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm hidden"></div>
                </div>
            </div>
        `;
    }

    renderDashboardView() {
        const user = this.user;
        return `
            <div class="min-h-screen bg-gray-50">
                <nav class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between h-16">
                            <div class="flex items-center">
                                <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="text-gray-700">Welcome, ${user?.name || user?.email}</span>
                                <button id="logout-btn" class="btn-secondary">Logout</button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- User Profile Card -->
                        <div class="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
                            <div class="flex items-center space-x-4 mb-6">
                                <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
                                    <p class="text-gray-600">Manage your account details</p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" id="profile-name" class="form-input" value="${user?.name || ''}" placeholder="Enter your name">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email (Read-only)</label>
                                    <input type="email" class="form-input bg-gray-50" value="${user?.email || ''}" disabled>
                                    <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">User ID (Read-only)</label>
                                    <input type="text" class="form-input bg-gray-50 font-mono text-sm" value="${user?.$id || ''}" disabled>
                                    <p class="text-xs text-gray-500 mt-1">Unique identifier for your account</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Account Created (Read-only)</label>
                                    <input type="text" class="form-input bg-gray-50" value="${user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'N/A'}" disabled>
                                </div>

                                <button id="update-profile-btn" class="btn-primary">Update Profile</button>
                            </div>
                        </div>

                        <!-- Account Statistics -->
                        <div class="bg-white rounded-xl shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
                            <div class="space-y-4">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Status:</span>
                                    <span class="text-green-600 font-medium">${user?.emailVerification ? 'Verified' : 'Unverified'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Last Updated:</span>
                                    <span class="text-gray-900">${user?.$updatedAt ? new Date(user.$updatedAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Account Type:</span>
                                    <span class="text-gray-900">Standard</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="dashboard-message" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm hidden"></div>
                    <div id="dashboard-error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm hidden"></div>
                </main>
            </div>
        `;
    }

    attachAuthEventListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabType = e.target.dataset.tab;
                this.switchAuthTab(tabType);
            });
        });

        // Form submission
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuthSubmit();
        });
    }

    attachDashboardEventListeners() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        document.getElementById('update-profile-btn').addEventListener('click', () => {
            this.handleUpdateProfile();
        });
    }

    switchAuthTab(tabType) {
        // Update tab appearance
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');

        // Show/hide name field for signup
        const nameField = document.getElementById('name-field');
        const submitBtn = document.getElementById('auth-submit');
        
        if (tabType === 'signup') {
            nameField.classList.remove('hidden');
            submitBtn.textContent = 'Sign Up';
        } else {
            nameField.classList.add('hidden');
            submitBtn.textContent = 'Sign In';
        }
    }

    async handleAuthSubmit() {
        const form = document.getElementById('auth-form');
        const formData = new FormData(form);
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const isSignup = document.querySelector('.auth-tab.active').dataset.tab === 'signup';

        this.setLoading(true);
        this.hideError('auth-error');

        try {
            let user;
            if (isSignup) {
                if (!name.trim()) {
                    throw new Error('Name is required for signup');
                }
                user = await account.create(ID.unique(), email, password, name);
                // After successful signup, sign them in
                await account.createEmailPasswordSession(email, password);
                user = await account.get();
            } else {
                await account.createEmailPasswordSession(email, password);
                user = await account.get();
            }

            this.setUser(user);
        } catch (error) {
            this.showError('auth-error', error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async handleLogout() {
        try {
            await account.deleteSession('current');
            this.setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async handleUpdateProfile() {
        const newName = document.getElementById('profile-name').value;
        
        if (!newName.trim()) {
            this.showError('dashboard-error', 'Name cannot be empty');
            return;
        }

        try {
            const updatedUser = await account.updateName(newName);
            this.setUser(updatedUser);
            this.showMessage('dashboard-message', 'Profile updated successfully!');
        } catch (error) {
            this.showError('dashboard-error', error.message);
        }
    }

    showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => errorEl.classList.add('hidden'), 5000);
    }

    showMessage(elementId, message) {
        const messageEl = document.getElementById(elementId);
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
        setTimeout(() => messageEl.classList.add('hidden'), 3000);
    }

    hideError(elementId) {
        document.getElementById(elementId).classList.add('hidden');
    }
}

// Initialize the app
const app = new AppState();

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', async () => {
    // Check for demo mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        // Show demo dashboard
        const mockUser = {
            $id: 'demo-user-12345',
            name: 'John Doe',
            email: 'john.doe@example.com',
            emailVerification: true,
            $createdAt: '2024-01-15T10:30:00.000Z',
            $updatedAt: '2024-01-20T14:45:00.000Z'
        };
        app.setUser(mockUser);
        return;
    }

    try {
        const user = await account.get();
        app.setUser(user);
    } catch (error) {
        // User not logged in, show auth view
        app.setUser(null);
    }
});