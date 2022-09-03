const moment = require('moment')

async function writeLogs(data) {
  console.log(`[${moment().toISOString()}]: ${data}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = { writeLogs, sleep }