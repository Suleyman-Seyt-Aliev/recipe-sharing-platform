// src/repositories/repository.test.js
const { Pool } = require('pg');
const PostgresUserRepository = require('./userRepository');
const PostgresRecipeRepository = require('./recipeRepository');
const { NotFoundError, AlreadyExistsError } = require('../domain/errors');
const { User } = require('../domain/models');

// ВАЖНО: Подключаемся к базе через localhost и порт 5433 (который мы указали в .env)
const pool = new Pool({
    host: '127.0.0.1',
    port: 5433,
    user: 'app_user',
    password: 'dbpassword', // Твой пароль из .env
    database: 'recipe_db'
});

const userRepo = new PostgresUserRepository(pool);

// Очищаем таблицу пользователей перед тестами (чтобы не было конфликтов)
beforeAll(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
});

afterAll(async () => {
    await pool.end(); // Закрываем соединение после всех тестов
});

// Тест 1: Создание и чтение
test('1. Создание и чтение пользователя (ID и дата заполняются БД)', async () => {
    const newUser = new User({
        email: 'test1@example.com',
        password_hash: 'hash123',
        role: 'author'
    });

    const created = await userRepo.create(newUser);
    expect(created.id).toBeDefined();
    expect(created.created_at).toBeDefined();

    const found = await userRepo.getById(created.id);
    expect(found.email).toBe('test1@example.com');
});

// Тест 2: Чтение несуществующей записи
test('2. Чтение несуществующей записи возвращает NotFoundError', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await expect(userRepo.getById(fakeId)).rejects.toThrow(NotFoundError);
});

// Тест 3: Дубликат уникального поля
test('3. Создание дубликата email возвращает AlreadyExistsError', async () => {
    const user2 = new User({ email: 'test2@example.com', password_hash: 'hash', role: 'author' });
    await userRepo.create(user2);

    const duplicate = new User({ email: 'test2@example.com', password_hash: 'hash', role: 'author' });
    await expect(userRepo.create(duplicate)).rejects.toThrow(AlreadyExistsError);
});

// Тест 4: Постраничная выборка (List)
test('4. Постраничная выборка возвращает не больше limit записей', async () => {
    const list = await userRepo.list(2, 0); // Лимит 2, смещение 0
    expect(list.length).toBeLessThanOrEqual(2);
});

// Тест 5: Удаление и последующее чтение
test('5. Удаление записи и последующее чтение возвращает NotFoundError', async () => {
    const user3 = new User({ email: 'delete@example.com', password_hash: 'hash', role: 'author' });
    const created = await userRepo.create(user3);

    await userRepo.delete(created.id);
    await expect(userRepo.getById(created.id)).rejects.toThrow(NotFoundError);
});

// Тест 6: Попытка SQL-инъекции в GetByEmail (бонус из методички)
test('6. SQL-инъекция в GetByEmail не срабатывает', async () => {
    // Если бы мы использовали склейку строк, этот ввод вернул бы всех юзеров
    const maliciousEmail = "' OR '1'='1";
    await expect(userRepo.getByEmail(maliciousEmail)).rejects.toThrow(NotFoundError);
});