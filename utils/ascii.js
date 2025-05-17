const figlet = require('figlet');
const gradient = require('gradient-string');

function printBanner() {
    figlet('PUPPET API', (err, data) => {
        if (!err) {
            console.log(gradient.fruit.multiline(data));
            console.log(gradient.instagram("🚀 ChatGPT Unofficial API Panel"));
        }
    });
}

module.exports = { printBanner };
