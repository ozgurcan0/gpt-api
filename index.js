const express = require('express');
const { connect } = require("puppeteer-real-browser");
const fs = require('fs');
const path = require('path');
const { printBanner } = require('./utils/ascii');
const { logInfo, logError, logRequest } = require('./utils/logger');
const { getProxy, getCookies } = require('./utils/config');

const app = express();
const PORT = process.env.PORT || 3000;

printBanner();

app.get('/message', async (req, res) => {
    const userMessage = req.query.get;
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!userMessage) {
        return res.status(400).json({ error: 'Lütfen ?get= ile bir mesaj gönderin.' });
    }

    logRequest(clientIP, userMessage);

    let browser;
    const startTime = Date.now();

    try {
        const proxy = getProxy();
        const cookies = getCookies();

        const connection = await connect({
            headless: false,
            args: proxy ? [`--proxy-server=${proxy}`] : [],
            customConfig: {},
            connectOption: {},
            turnstile: true,
            disableXvfb: false,
            ignoreAllFlags: false,
        });

        browser = connection.browser;
        const page = connection.page;

        if (cookies) {
            await page.setCookie(...cookies);
            logInfo("Cookies yüklendi.");
        }

        await page.goto("https://chatgpt.com", { waitUntil: 'domcontentloaded' });

        const tryClick = async (selector, timeout = 2000) => {
            try {
                await page.waitForSelector(selector, { timeout });
                await page.click(selector);
            } catch {}
        };

        await tryClick('.btn.relative.btn-ghost');
        await tryClick('#radix-\\:r7\\: button');

        await page.waitForSelector('#prompt-textarea', { timeout: 3000 });
        await page.focus('#prompt-textarea');
        await page.keyboard.type(userMessage);

        await page.waitForSelector('#composer-submit-button', { timeout: 2000 });
        await page.click('#composer-submit-button');

        const response = await page.evaluate(async () => {
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            let last = '', stable = 0, start = Date.now();

            while ((Date.now() - start) < 20000) {
                const txt = Array.from(document.querySelectorAll('div[role="presentation"] p'))
                    .map(p => p.textContent).join('\n').trim();
                if (txt === last) {
                    stable += 250;
                    if (stable >= 1500) break;
                } else {
                    last = txt;
                    stable = 0;
                }
                await sleep(250);
            }

            return last;
        });

        const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

        if (response) {
            res.json({
                response,
                requestedMessage: userMessage,
                responseTimeInSeconds: parseFloat(responseTime),
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ error: 'Yanıt alınamadı', responseTimeInSeconds: parseFloat(responseTime) });
        }

    } catch (err) {
        const errorTime = ((Date.now() - startTime) / 1000).toFixed(2);
        logError("HATA: " + err.message);
        res.status(500).json({
            error: 'İşlem sırasında hata oluştu',
            details: err.message,
            responseTimeInSeconds: parseFloat(errorTime),
            timestamp: new Date().toISOString()
        });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    logInfo(`🔌 Sunucu ${PORT} portunda çalışıyor.`);
});
