#!/usr/bin/env node

/**
 * WebMonitor - Website Change Monitoring Service
 * 
 * This service monitors websites for changes and sends notifications
 * when changes are detected.
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class WebsiteMonitor {
    constructor() {
        this.monitoredSites = new Map();
        this.dataFile = path.join(__dirname, 'monitored-sites.json');
        this.loadData();
    }

    async loadData() {
        try {
            const data = await fs.readFile(this.dataFile, 'utf8');
            const sites = JSON.parse(data);
            sites.forEach(site => {
                this.monitoredSites.set(site.id, site);
                this.scheduleCheck(site);
            });
            console.log(`Loaded ${sites.length} monitored sites`);
        } catch (error) {
            console.log('No existing data file found, starting fresh');
        }
    }

    async saveData() {
        try {
            const sites = Array.from(this.monitoredSites.values());
            await fs.writeFile(this.dataFile, JSON.stringify(sites, null, 2));
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }

    async addSite(siteData) {
        const site = {
            ...siteData,
            id: siteData.id || crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: 'active',
            lastChecked: null,
            changesDetected: 0,
            contentHash: null
        };

        this.monitoredSites.set(site.id, site);
        await this.saveData();

        // Get initial content hash
        try {
            const content = await this.fetchWebsiteContent(site.url);
            site.contentHash = this.hashContent(content);
            site.lastChecked = new Date().toISOString();
            await this.saveData();
            console.log(`✅ Added monitoring for ${site.url}`);
        } catch (error) {
            console.error(`❌ Failed to get initial content for ${site.url}:`, error.message);
        }

        // Start monitoring
        this.scheduleCheck(site);
        return site;
    }

    scheduleCheck(site) {
        const intervalMs = site.frequency * 60 * 1000;
        
        setTimeout(async () => {
            try {
                await this.checkForChanges(site);
            } catch (error) {
                console.error(`Error checking ${site.url}:`, error.message);
            }
            
            // Schedule next check if site is still active
            if (this.monitoredSites.has(site.id)) {
                this.scheduleCheck(site);
            }
        }, intervalMs);
    }

    async checkForChanges(site) {
        try {
            console.log(`🔍 Checking ${site.url}...`);
            const content = await this.fetchWebsiteContent(site.url);
            const currentHash = this.hashContent(content);
            
            if (site.contentHash && currentHash !== site.contentHash) {
                // Content changed!
                site.changesDetected++;
                site.contentHash = currentHash;
                site.lastChecked = new Date().toISOString();
                
                console.log(`🚨 Change detected on ${site.url}! Sending notifications...`);
                
                // Send notifications
                await this.sendEmailNotification(site);
                
                if (site.webhookUrl) {
                    await this.sendWebhookNotification(site);
                }
                
                await this.saveData();
            } else {
                site.lastChecked = new Date().toISOString();
                await this.saveData();
                console.log(`✅ No changes detected on ${site.url}`);
            }
            
        } catch (error) {
            console.error(`❌ Error checking ${site.url}:`, error.message);
            // Update last checked time even on error
            site.lastChecked = new Date().toISOString();
            await this.saveData();
        }
    }

    fetchWebsiteContent(url) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'WebMonitor/1.0 (+https://webmonitor.service)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                timeout: 30000
            };

            const req = client.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    hashContent(content) {
        // Remove timestamps and dynamic content before hashing
        const cleanedContent = content
            .replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, '') // Remove timestamps
            .replace(/\d{10,13}/g, '') // Remove unix timestamps
            .replace(/nonce="[^"]*"/g, '') // Remove nonces
            .replace(/csrf[_-]?token["']\s*[:=]\s*["'][^"']*["']/gi, '') // Remove CSRF tokens
            .trim();
            
        return crypto.createHash('sha256').update(cleanedContent).digest('hex');
    }

    async sendEmailNotification(site) {
        // In a production environment, you would integrate with an email service
        // like SendGrid, AWS SES, or similar
        console.log(`📧 EMAIL NOTIFICATION:`);
        console.log(`   To: ${site.email}`);
        console.log(`   Subject: Website Change Detected - ${site.url}`);
        console.log(`   Body: Changes have been detected on your monitored website: ${site.url}`);
        console.log(`   Changes detected: ${site.changesDetected}`);
        console.log(`   Last checked: ${site.lastChecked}`);
    }

    async sendWebhookNotification(site) {
        try {
            const payload = {
                url: site.url,
                changesDetected: site.changesDetected,
                lastChecked: site.lastChecked,
                message: `Changes detected on ${site.url}`,
                timestamp: new Date().toISOString()
            };

            const urlObj = new URL(site.webhookUrl);
            const client = urlObj.protocol === 'https:' ? https : http;
            const postData = JSON.stringify(payload);

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'WebMonitor/1.0'
                },
                timeout: 10000
            };

            const req = client.request(options, (res) => {
                console.log(`📡 Webhook sent to ${site.webhookUrl} - Status: ${res.statusCode}`);
            });

            req.on('error', (error) => {
                console.error(`❌ Webhook failed for ${site.webhookUrl}:`, error.message);
            });

            req.write(postData);
            req.end();

        } catch (error) {
            console.error(`❌ Webhook error for ${site.url}:`, error.message);
        }
    }

    getSites() {
        return Array.from(this.monitoredSites.values());
    }

    removeSite(siteId) {
        const removed = this.monitoredSites.delete(siteId);
        if (removed) {
            this.saveData();
            console.log(`🗑️ Removed monitoring for site ID: ${siteId}`);
        }
        return removed;
    }
}

// CLI Interface
if (require.main === module) {
    const monitor = new WebsiteMonitor();
    
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'add':
            const url = args[1];
            const email = args[2];
            const frequency = parseInt(args[3]) || 30;
            
            if (!url || !email) {
                console.log('Usage: node monitor-service.js add <url> <email> [frequency_minutes]');
                process.exit(1);
            }
            
            monitor.addSite({
                url,
                email,
                frequency,
                webhookUrl: args[4] || null,
                notes: args[5] || null
            });
            break;
            
        case 'list':
            const sites = monitor.getSites();
            console.log(`\n📊 Monitored Sites (${sites.length}):`);
            sites.forEach(site => {
                console.log(`  • ${site.url}`);
                console.log(`    Email: ${site.email}`);
                console.log(`    Frequency: Every ${site.frequency} minutes`);
                console.log(`    Status: ${site.status}`);
                console.log(`    Changes: ${site.changesDetected}`);
                console.log(`    Last checked: ${site.lastChecked || 'Never'}`);
                console.log();
            });
            break;
            
        case 'remove':
            const siteId = args[1];
            if (!siteId) {
                console.log('Usage: node monitor-service.js remove <site_id>');
                process.exit(1);
            }
            monitor.removeSite(siteId);
            break;
            
        case 'daemon':
            console.log('🚀 WebMonitor daemon started');
            console.log('Press Ctrl+C to stop');
            
            // Keep the process running
            process.on('SIGINT', () => {
                console.log('\n🛑 Shutting down WebMonitor daemon...');
                process.exit(0);
            });
            break;
            
        default:
            console.log('WebMonitor - Website Change Monitoring Service');
            console.log('');
            console.log('Usage:');
            console.log('  node monitor-service.js add <url> <email> [frequency] [webhook] [notes]');
            console.log('  node monitor-service.js list');
            console.log('  node monitor-service.js remove <site_id>');
            console.log('  node monitor-service.js daemon');
            console.log('');
            console.log('Examples:');
            console.log('  node monitor-service.js add https://news.ycombinator.com user@example.com 15');
            console.log('  node monitor-service.js add https://example.com user@example.com 30 https://hooks.slack.com/webhook');
            process.exit(1);
    }
}

module.exports = WebsiteMonitor;