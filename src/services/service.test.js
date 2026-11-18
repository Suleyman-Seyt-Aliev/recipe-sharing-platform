// src/services/service.test.js
const RecipeService = require('./recipeService');
const UserService = require('./userService');
const { InvalidInputError, NotFoundError } = require('../domain/errors');

// Создаем "заглушки" (mocks) для репозиториев
const mockRecipeRepo = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockUserRepo = {
    create: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
};

describe('Тестирование бизнес-логики (Service Layer)', () => {
    let recipeService;
    let userService;

    beforeEach(() => {
        jest.clearAllMocks(); // Очищаем историю вызовов перед каждым тестом
        recipeService = new RecipeService(mockRecipeRepo);
        userService = new UserService(mockUserRepo);
    });

    // ТЕСТ 1: Успешное создание рецепта
    test('1. Успешное создание рецепта', async () => {
        const validData = { title: 'Борщ', cooking_time: 60, servings_base: 4 };
        mockRecipeRepo.create.mockResolvedValue({ id: 1, ...validData });

        const result = await recipeService.createRecipe(validData);
        
        expect(result.id).toBe(1);
        expect(mockRecipeRepo.create).toHaveBeenCalledTimes(1); // Проверяем, что репозиторий был вызван
    });

    // ТЕСТ 2: Нарушение бизнес-правила (отрицательное время готовки)
    test('2. Ошибка при создании рецепта с отрицательным временем', async () => {
        const invalidData = { title: 'Борщ', cooking_time: -10, servings_base: 4 };

        // Ожидаем, что сервис выбросит ошибку InvalidInputError
        await expect(recipeService.createRecipe(invalidData))
            .rejects.toThrow(InvalidInputError);
            
        // И при этом репозиторий (база данных) НЕ должен быть вызван
        expect(mockRecipeRepo.create).not.toHaveBeenCalled();
    });

    // ТЕСТ 3: Успешное создание пользователя
    test('3. Успешное создание пользователя', async () => {
        const validUser = { email: 'test@test.com', password_hash: '123', role: 'author' };
        mockUserRepo.create.mockResolvedValue({ id: 1, ...validUser });

        const result = await userService.createUser(validUser);
        expect(result.email).toBe('test@test.com');
        expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
    });

    // ТЕСТ 4: Нарушение правила (email без @)
    test('4. Ошибка при создании пользователя с некорректным email', async () => {
        const invalidUser = { email: 'testtest.com', password_hash: '123', role: 'author' };

        await expect(userService.createUser(invalidUser))
            .rejects.toThrow(InvalidInputError);
        expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    // ТЕСТ 5: Получение несуществующего рецепта
    test('5. Получение несуществующего рецепта возвращает NotFoundError', async () => {
        mockRecipeRepo.getById.mockResolvedValue(null); // База говорит, что ничего не нашла

        await expect(recipeService.getRecipeById(999))
            .rejects.toThrow(NotFoundError);
    });
});