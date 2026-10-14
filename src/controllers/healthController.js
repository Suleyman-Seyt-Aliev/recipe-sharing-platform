const config = require('../config');

exports.getHealth = (req, res) => {
    res.status(200).json({
        status: 'pass',
        app_name: config.appName,
        version: config.version,
        environment: config.env,
        uptime: process.uptime() // время работы сервера в секундах
    });
};