#!/usr/bin/env node

/**
 * WebMonitor API Server
 * 
 * HTTP API server for the WebMonitor frontend
 */

const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const WebsiteMonitor = require('./monitor-service');

class WebMonitorAPI {
    constructor(port = 3000) {
        this.port = port;
        this.monitor = new WebsiteMonitor();
        this.server = this.createServer();
    }

    createServer() {
        return http.createServer(async (req, res) => {
            // Enable CORS for frontend
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            try {
                await this.handleRequest(req, res);
            } catch (error) {
                console.error('Request error:', error);
                this.sendError(res, 500, 'Internal Server Error');
            }
        });
    }

    async handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        console.log(`${method} ${pathname}`);

        // Authentication endpoints
        if (pathname === '/api/auth/signup' && method === 'POST') {
            await this.handleSignup(req, res);
        } else if (pathname === '/api/auth/signin' && method === 'POST') {
            await this.handleSignin(req, res);
        } else if (pathname === '/api/auth/signout' && method === 'POST') {
            await this.handleSignout(req, res);
        } else if (pathname === '/api/auth/me' && method === 'GET') {
            await this.handleGetCurrentUser(req, res);
        }
        // Site management endpoints (require authentication)
        else if (pathname === '/api/sites' && method === 'GET') {
            await this.handleGetSites(req, res);
        } else if (pathname === '/api/sites' && method === 'POST') {
            await this.handleAddSite(req, res);
        } else if (pathname.startsWith('/api/sites/') && method === 'DELETE') {
            await this.handleRemoveSite(req, res);
        } else if (pathname === '/api/health' && method === 'GET') {
            await this.handleHealth(req, res);
        } else {
            this.sendError(res, 404, 'Not Found');
        }
    }

    async handleSignup(req, res) {
        try {
            const body = await this.getRequestBody(req);
            const userData = JSON.parse(body);

            // Validate required fields
            if (!userData.name || !userData.email || !userData.password) {
                return this.sendError(res, 400, 'Name, email and password are required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                return this.sendError(res, 400, 'Invalid email format');
            }

            // Validate password strength
            if (userData.password.length < 8) {
                return this.sendError(res, 400, 'Password must be at least 8 characters long');
            }

            // Check if user already exists (in a real app, this would be in a database)
            const existingUsers = this.loadUsers();
            if (existingUsers.find(u => u.email === userData.email)) {
                return this.sendError(res, 409, 'User with this email already exists');
            }

            // Create new user
            const newUser = {
                id: this.generateUserId(),
                name: userData.name,
                email: userData.email,
                password: this.hashPassword(userData.password), // In production, use proper hashing
                createdAt: new Date().toISOString()
            };

            existingUsers.push(newUser);
            this.saveUsers(existingUsers);

            // Create session token
            const sessionToken = this.generateSessionToken();
            const userSession = {
                userId: newUser.id,
                token: sessionToken,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            };

            this.saveSessions([...this.loadSessions(), userSession]);

            // Return user data without password
            const { password, ...userResponse } = newUser;
            
            this.sendJSON(res, 201, {
                success: true,
                user: userResponse,
                token: sessionToken,
                message: 'Account created successfully'
            });

        } catch (error) {
            console.error('Error creating account:', error);
            if (error instanceof SyntaxError) {
                this.sendError(res, 400, 'Invalid JSON');
            } else {
                this.sendError(res, 500, 'Failed to create account');
            }
        }
    }

    async handleSignin(req, res) {
        try {
            const body = await this.getRequestBody(req);
            const { email, password } = JSON.parse(body);

            if (!email || !password) {
                return this.sendError(res, 400, 'Email and password are required');
            }

            // Find user
            const users = this.loadUsers();
            const user = users.find(u => u.email === email);

            if (!user || !this.verifyPassword(password, user.password)) {
                return this.sendError(res, 401, 'Invalid email or password');
            }

            // Create session token
            const sessionToken = this.generateSessionToken();
            const userSession = {
                userId: user.id,
                token: sessionToken,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };

            const sessions = this.loadSessions();
            sessions.push(userSession);
            this.saveSessions(sessions);

            // Return user data without password
            const { password: _, ...userResponse } = user;

            this.sendJSON(res, 200, {
                success: true,
                user: userResponse,
                token: sessionToken,
                message: 'Signed in successfully'
            });

        } catch (error) {
            console.error('Error signing in:', error);
            this.sendError(res, 500, 'Sign in failed');
        }
    }

    async handleSignout(req, res) {
        try {
            const authToken = this.getAuthToken(req);
            
            if (authToken) {
                // Remove session
                const sessions = this.loadSessions();
                const updatedSessions = sessions.filter(s => s.token !== authToken);
                this.saveSessions(updatedSessions);
            }

            this.sendJSON(res, 200, {
                success: true,
                message: 'Signed out successfully'
            });

        } catch (error) {
            console.error('Error signing out:', error);
            this.sendError(res, 500, 'Sign out failed');
        }
    }

    async handleGetCurrentUser(req, res) {
        try {
            const user = await this.authenticateRequest(req);
            
            if (!user) {
                return this.sendError(res, 401, 'Not authenticated');
            }

            const { password, ...userResponse } = user;
            
            this.sendJSON(res, 200, {
                success: true,
                user: userResponse
            });

        } catch (error) {
            console.error('Error getting current user:', error);
            this.sendError(res, 500, 'Failed to get user information');
        }
    }

    async authenticateRequest(req) {
        const authToken = this.getAuthToken(req);
        
        if (!authToken) {
            return null;
        }

        // Find valid session
        const sessions = this.loadSessions();
        const session = sessions.find(s => 
            s.token === authToken && 
            new Date(s.expiresAt) > new Date()
        );

        if (!session) {
            return null;
        }

        // Find user
        const users = this.loadUsers();
        const user = users.find(u => u.id === session.userId);

        return user || null;
    }

    getAuthToken(req) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    }

    async handleGetSites(req, res) {
        try {
            const user = await this.authenticateRequest(req);
            
            if (!user) {
                return this.sendError(res, 401, 'Authentication required');
            }

            // Get user's sites from monitor service
            const allSites = this.monitor.getSites();
            const userSites = allSites.filter(site => site.userId === user.id);
            
            this.sendJSON(res, 200, { sites: userSites });

        } catch (error) {
            console.error('Error getting sites:', error);
            this.sendError(res, 500, 'Failed to get sites');
        }
    }

    async handleAddSite(req, res) {
        try {
            const user = await this.authenticateRequest(req);
            
            if (!user) {
                return this.sendError(res, 401, 'Authentication required');
            }

            const body = await this.getRequestBody(req);
            const siteData = JSON.parse(body);

            // Validate required fields
            if (!siteData.url) {
                return this.sendError(res, 400, 'URL is required');
            }

            // Validate URL format
            try {
                new URL(siteData.url);
            } catch {
                return this.sendError(res, 400, 'Invalid URL format');
            }

            // Add user information to site data
            const siteToAdd = {
                ...siteData,
                userId: user.id,
                userEmail: user.email,
                frequency: parseInt(siteData.frequency) || 30,
                webhookUrl: siteData.webhookUrl || null,
                notes: siteData.notes || null
            };

            const site = await this.monitor.addSite(siteToAdd);

            this.sendJSON(res, 201, { 
                success: true, 
                site,
                message: `Successfully started monitoring ${site.url}` 
            });

        } catch (error) {
            console.error('Error adding site:', error);
            if (error instanceof SyntaxError) {
                this.sendError(res, 400, 'Invalid JSON');
            } else {
                this.sendError(res, 500, 'Failed to add site');
            }
        }
    }

    async handleRemoveSite(req, res) {
        try {
            const user = await this.authenticateRequest(req);
            
            if (!user) {
                return this.sendError(res, 401, 'Authentication required');
            }

            const siteId = req.url.split('/').pop();
            
            // Verify user owns the site
            const allSites = this.monitor.getSites();
            const site = allSites.find(s => s.id === siteId);
            
            if (!site) {
                return this.sendError(res, 404, 'Site not found');
            }
            
            if (site.userId !== user.id) {
                return this.sendError(res, 403, 'Access denied');
            }

            const removed = this.monitor.removeSite(siteId);
            
            if (removed) {
                this.sendJSON(res, 200, { 
                    success: true, 
                    message: 'Site removed successfully' 
                });
            } else {
                this.sendError(res, 404, 'Site not found');
            }

        } catch (error) {
            console.error('Error removing site:', error);
            this.sendError(res, 500, 'Failed to remove site');
        }
    }

    // Helper methods for user and session management
    loadUsers() {
        try {
            const data = require('fs').readFileSync(
                require('path').join(__dirname, 'users.json'), 
                'utf8'
            );
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    saveUsers(users) {
        try {
            require('fs').writeFileSync(
                require('path').join(__dirname, 'users.json'),
                JSON.stringify(users, null, 2)
            );
        } catch (error) {
            console.error('Failed to save users:', error);
        }
    }

    loadSessions() {
        try {
            const data = require('fs').readFileSync(
                require('path').join(__dirname, 'sessions.json'), 
                'utf8'
            );
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    saveSessions(sessions) {
        try {
            require('fs').writeFileSync(
                require('path').join(__dirname, 'sessions.json'),
                JSON.stringify(sessions, null, 2)
            );
        } catch (error) {
            console.error('Failed to save sessions:', error);
        }
    }

    generateUserId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    generateSessionToken() {
        return require('crypto').randomBytes(32).toString('hex');
    }

    hashPassword(password) {
        // In production, use proper password hashing like bcrypt
        // This is just for demo purposes
        return require('crypto').createHash('sha256').update(password).digest('hex');
    }

    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    async handleHealth(req, res) {
        const sites = this.monitor.getSites();
        this.sendJSON(res, 200, {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            monitoredSites: sites.length,
            uptime: process.uptime()
        });
    }

    getRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
            req.on('error', reject);
        });
    }

    sendJSON(res, statusCode, data) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    sendError(res, statusCode, message) {
        this.sendJSON(res, statusCode, { 
            error: true, 
            message 
        });
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🚀 WebMonitor API server running on port ${this.port}`);
            console.log(`   Health check: http://localhost:${this.port}/api/health`);
            console.log(`   API endpoints:`);
            console.log(`     GET    /api/sites       - List all monitored sites`);
            console.log(`     POST   /api/sites       - Add new site to monitor`);
            console.log(`     DELETE /api/sites/:id   - Remove monitored site`);
        });
    }

    stop() {
        this.server.close();
    }
}

if (require.main === module) {
    const port = process.env.PORT || 3000;
    const api = new WebMonitorAPI(port);
    
    api.start();
    
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down API server...');
        api.stop();
        process.exit(0);
    });
}

module.exports = WebMonitorAPI;