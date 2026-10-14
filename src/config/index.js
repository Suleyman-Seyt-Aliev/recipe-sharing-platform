require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    appName: process.env.APP_NAME || 'API',
    version: process.env.APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development'
};