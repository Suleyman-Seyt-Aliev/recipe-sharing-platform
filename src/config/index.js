require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    appName: process.env.APP_NAME || 'API',
    version: process.env.APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    db: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        maxConns: parseInt(process.env.DB_MAX_CONNS || '10', 10)
    }
};

// Проверка обязательных переменных (как в методичке)
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const varName of requiredVars) {
    if (!process.env[varName]) {
        console.error(`[CONFIG] Ошибка: Обязательная переменная окружения ${varName} не задана!`);
        process.exit(1); // Экстренно завершаем работу
    }
}

module.exports = config;