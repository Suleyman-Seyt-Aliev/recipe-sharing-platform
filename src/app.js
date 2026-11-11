const express = require('express');
const config = require('./config');
const { connectWithRetry, getPool } = require('./repositories/database');
const healthController = require('./controllers/healthController');

// Импортируем наши новые репозитории
const PostgresUserRepository = require('./repositories/userRepository');
const PostgresRecipeRepository = require('./repositories/recipeRepository');
const PostgresIngredientRepository = require('./repositories/ingredientRepository');

const app = express();

app.get('/api/v1/health', healthController.getHealth);

async function startServer() {
    try {
        console.log('[CONFIG] Загрузка переменных окружения прошла успешно');
        
        // Подключаемся к БД
        await connectWithRetry();
        const pool = getPool();

        // Инициализируем репозитории (в будущем передадим их в сервисы/контроллеры)
        const userRepo = new PostgresUserRepository(pool);
        const recipeRepo = new PostgresRecipeRepository(pool);
        const ingredientRepo = new PostgresIngredientRepository(pool);
        
        console.log('[REPOSITORIES] Все репозитории успешно инициализированы');
        
        app.listen(config.port, () => {
            console.log(`[HTTP] Сервер запущен на порту ${config.port}`);
        });
    } catch (err) {
        console.error('Критическая ошибка при запуске:', err);
        process.exit(1);
    }
}

startServer();