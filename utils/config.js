const fs = require('fs');
const path = require('path');

function getProxy() {
    const filePath = path.join(__dirname, '..', 'proxy.txt');
    if (fs.existsSync(filePath)) {
        const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
        if (lines.length > 0) {
            const proxy = lines[Math.floor(Math.random() * lines.length)].trim();
            return proxy;
        }
    }
    return null;
}

function getCookies() {
    const filePath = path.join(__dirname, '..', 'cookies.json');
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch {
            return null;
        }
    }
    return null;
}

module.exports = { getProxy, getCookies };
