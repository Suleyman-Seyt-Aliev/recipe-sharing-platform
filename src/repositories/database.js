const { Pool } = require('pg');
const config = require('../config');

let pool;

async function connectWithRetry() {
    pool = new Pool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        max: config.db.maxConns,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

     pool.on('error', (err) => {
        console.error('Ошибка в простое пула соединений:', err.message);
    });

    const maxAttempts = 10;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Пытаемся сделать простой запрос для проверки
            await pool.query('SELECT 1');
            console.log(`[DATABASE] Успешное подключение к PostgreSQL на ${config.db.host}:${config.db.port}`);
            return pool;
        } catch (err) {
            console.log(`[DATABASE] Попытка ${attempt}/${maxAttempts} не удалась: ${err.message}`);
            if (attempt === maxAttempts) {
                throw new Error('Не удалось подключиться к базе данных после всех попыток.');
            }
            // Ждем перед следующей попыткой (линейно растущая пауза)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
}

function getPool() {
    if (!pool) throw new Error('База данных не инициализирована');
    return pool;
}

module.exports = { connectWithRetry, getPool };