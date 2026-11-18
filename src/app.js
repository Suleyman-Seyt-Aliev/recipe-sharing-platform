const express = require('express');
const config = require('./config');
const { connectWithRetry, getPool } = require('./repositories/database');
const healthController = require('./controllers/healthController');
const errorHandler = require('./middlewares/errorHandler');

// Репозитории
const PostgresUserRepository = require('./repositories/userRepository');
const PostgresRecipeRepository = require('./repositories/recipeRepository');

// Сервисы
const RecipeService = require('./services/recipeService');
const UserService = require('./services/userService');

// Контроллеры
const RecipeController = require('./controllers/recipeController');
const UserController = require('./controllers/userController');

const app = express();
app.use(express.json()); // Чтобы Express понимал JSON в теле запроса

app.get('/api/v1/health', healthController.getHealth);

async function startServer() {
    try {
        console.log('[CONFIG] Переменные окружения загружены');
        await connectWithRetry();
        const pool = getPool();

        // 1. Инициализация репозиториев (Dependency Injection)
        const userRepo = new PostgresUserRepository(pool);
        const recipeRepo = new PostgresRecipeRepository(pool);

        // 2. Инициализация сервисов (внедряем репозитории)
        const recipeService = new RecipeService(recipeRepo);
        const userService = new UserService(userRepo);

        // 3. Инициализация контроллеров (внедряем сервисы)
        const recipeController = new RecipeController(recipeService);
        const userController = new UserController(userService);

        // 4. Роутинг (привязка URL к методам контроллеров)
        app.post('/api/v1/recipes', recipeController.create);
        app.get('/api/v1/recipes', recipeController.list);
        app.get('/api/v1/recipes/:id', recipeController.getById);
        app.put('/api/v1/recipes/:id', recipeController.update);
        app.delete('/api/v1/recipes/:id', recipeController.delete);

        app.post('/api/v1/users', userController.create);
        app.get('/api/v1/users/:id', userController.getById);
        app.delete('/api/v1/users/:id', userController.delete);

        // 5. Подключаем middleware для обработки ошибок (ДОЛЖЕН БЫТЬ В САМОМ КОНЦЕ)
        app.use(errorHandler);

        app.listen(config.port, () => {
            console.log(`[HTTP] Сервер запущен на порту ${config.port}`);
        });
    } catch (err) {
        console.error('Критическая ошибка при запуске:', err);
        process.exit(1);
    }
}

startServer();