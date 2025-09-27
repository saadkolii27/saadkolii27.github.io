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

        if (pathname === '/api/sites' && method === 'GET') {
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

    async handleGetSites(req, res) {
        const sites = this.monitor.getSites();
        this.sendJSON(res, 200, { sites });
    }

    async handleAddSite(req, res) {
        try {
            const body = await this.getRequestBody(req);
            const siteData = JSON.parse(body);

            // Validate required fields
            if (!siteData.url || !siteData.email) {
                return this.sendError(res, 400, 'URL and email are required');
            }

            // Validate URL format
            try {
                new URL(siteData.url);
            } catch {
                return this.sendError(res, 400, 'Invalid URL format');
            }

            // Validate email format (basic)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(siteData.email)) {
                return this.sendError(res, 400, 'Invalid email format');
            }

            const site = await this.monitor.addSite({
                url: siteData.url,
                email: siteData.email,
                frequency: parseInt(siteData.frequency) || 30,
                webhookUrl: siteData.webhookUrl || null,
                notes: siteData.notes || null
            });

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
        const siteId = req.url.split('/').pop();
        const removed = this.monitor.removeSite(siteId);
        
        if (removed) {
            this.sendJSON(res, 200, { 
                success: true, 
                message: 'Site removed successfully' 
            });
        } else {
            this.sendError(res, 404, 'Site not found');
        }
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