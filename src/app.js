const express = require('express');
const config = require('./config');
const { connectWithRetry } = require('./repositories/database');
const healthController = require('./controllers/healthController');

const app = express();

app.get('/api/v1/health', healthController.getHealth);

async function startServer() {
    try {
        console.log('[CONFIG] Загрузка переменных окружения прошла успешно');
        // Подключаемся к БД перед запуском
        await connectWithRetry();
        
        app.listen(config.port, () => {
            console.log(`[HTTP] Сервер запущен на порту ${config.port}`);
        });
    } catch (err) {
        console.error('Критическая ошибка при запуске:', err);
        process.exit(1);
    }
}

startServer();