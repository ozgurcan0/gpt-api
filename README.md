# 🧠 ChatGPT Web Scraper API (Puppeteer + Express)

This project is an Express-based HTTP API that uses `Puppeteer Modded` to automate interactions with the ChatGPT web interface. It allows sending prompts and receiving responses programmatically through a RESTful API.

---

## 🚀 Features

- Built with **Express.js** and **puppeteer-real-browser**
- Full browser automation (non-headless by default)
- **Asynchronous** request handling
- Optional support for:
  - `proxy.txt` – random proxy rotation
  - `cookies.json` – inject custom cookies
- Colorful logs using `chalk`, `figlet`, and `gradient-string`
- Fancy ASCII banner on startup
- Logs connected IPs, queries, response times
- Automatic answer detection & wait logic
- Graceful error handling & performance metrics

---

## 📦 Installation

```bash
git clone https://github.com/your-username/chatgpt-web-api
cd chatgpt-web-api
npm install
```

If you get errors related to `chalk` usage, downgrade to version 4.x for CommonJS support:

```bash
npm uninstall chalk
npm install chalk@4
```

---

## 🛠 Project Structure

```
.
├── index.js              # Main Express server
├── utils/
│   ├── ascii.js          # ASCII banner generator
│   ├── logger.js         # Colored logging utilities
│   └── config.js         # Proxy and cookie loader helpers
├── proxy.txt             # (Optional) List of proxies, one per line
└── cookies.json          # (Optional) Browser cookies JSON file
```

---

## ⚙️ Configuration

- **Proxy support:**  
  Add your HTTP/HTTPS proxies one per line in `proxy.txt`. The server will randomly pick one per request.

- **Cookie injection:**  
  Export cookies from your browser (JSON format) and save as `cookies.json` in the root directory.

Both features are **optional**. If no proxy.txt or cookies.json is found, default browser launch will be without proxy or cookies.

---

## 🔌 API Usage

### Endpoint

```
GET /message?get=YOUR_PROMPT
```

### Example

```bash
curl "http://localhost:3000/message?get=Hello%20World"
```

### Response

```json
{
  "response": "ChatGPT response text here...",
  "requestedMessage": "Hello World",
  "responseTimeInSeconds": 12.34,
  "timestamp": "2025-05-16T10:00:00.000Z"
}
```

---

## 🧩 How It Works

- The server listens on port 3000 by default.
- On each request:
  - Optionally loads a random proxy from `proxy.txt`
  - Optionally loads cookies from `cookies.json`
  - Launches a **real browser** using `puppeteer-real-browser`
  - Navigates to `https://chatgpt.com`
  - Enters the user prompt
  - Waits for ChatGPT's answer with a timeout and stability check
  - Returns the response as JSON
- Logs all requests with IP and message to the console, with colored ASCII art header on startup.

---

## 🛡️ Error Handling

- If no prompt is provided, returns HTTP 400 with error message.
- If Puppeteer or page interaction fails, returns HTTP 500 with error details.
- Closes browser gracefully after each request.

---

## 📞 Contact

For issues or feature requests, please open an issue on GitHub.

---

# !
- This repository has been created solely for educational and research purposes. It is not intended for any malicious or unauthorized use.-
*Happy scraping! 🚀*
