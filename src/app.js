const express = require('express');
const config = require('./config');
const healthController = require('./controllers/healthController');

const app = express();

// Health-check эндпоинт
app.get('/api/v1/health', healthController.getHealth);

// Запуск сервера
app.listen(config.port, () => {
    console.log(`Сервер запущен на порту ${config.port}`);
});