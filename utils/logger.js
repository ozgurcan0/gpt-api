const chalk = require('chalk');

function logInfo(message) {
    console.log(chalk.green(`[INFO] ${message}`));
}

function logError(message) {
    console.log(chalk.red(`[ERROR] ${message}`));
}

function logRequest(ip, msg) {
    console.log(chalk.blue(`[REQUEST] IP: ${ip} - Message: "${msg}"`));
}

module.exports = { logInfo, logError, logRequest };
