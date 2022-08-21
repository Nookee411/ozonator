require('dotenv').config()
const processQueue = require('./queueProcessor')
var cron = require('node-cron');

cron.schedule('* * * * *', processQueue);


