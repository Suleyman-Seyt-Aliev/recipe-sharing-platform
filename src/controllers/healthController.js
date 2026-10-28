const config = require('../config');
const { getPool } = require('../repositories/database');

exports.getHealth = async (req, res) => {
    try {
        const pool = getPool();
        // Проверяем, отвечает ли база
        await pool.query('SELECT 1');
        
        res.status(200).json({
            status: 'ok',
            db: 'up',
            app_name: config.appName,
            version: config.version,
            environment: config.env,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unavailable',
            db: 'down',
            error: 'Database connection failed'
        });
    }
};