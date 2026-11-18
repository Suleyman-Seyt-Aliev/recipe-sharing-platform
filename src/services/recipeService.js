// src/services/recipeService.js
const { InvalidInputError, NotFoundError } = require('../domain/errors');

class RecipeService {
    // Внедрение зависимости (репозитория) через конструктор
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async createRecipe(data) {
        // Бизнес-правило 1: Время готовки должно быть > 0
        if (data.cooking_time <= 0) {
            throw new InvalidInputError('Время готовки должно быть больше нуля');
        }
        // Бизнес-правило 2: Количество порций должно быть > 0
        if (data.servings_base <= 0) {
            throw new InvalidInputError('Количество порций должно быть больше нуля');
        }
        // Бизнес-правило 3: Название не должно быть пустым
        if (!data.title || data.title.trim() === '') {
            throw new InvalidInputError('Название рецепта обязательно');
        }

        // Если проверки пройдены, передаем данные в репозиторий (в БД)
        return await this.recipeRepository.create(data);
    }

    async getRecipeById(id) {
        const recipe = await this.recipeRepository.getById(id);
        if (!recipe) {
            throw new NotFoundError('Рецепт не найден');
        }
        return recipe;
    }

    async listRecipes(limit, offset) {
        // Ограничиваем limit, чтобы клиент не запросил миллион записей
        const safeLimit = limit > 100 ? 100 : limit;
        return await this.recipeRepository.list(safeLimit, offset);
    }

    async updateRecipe(id, data) {
        if (data.cooking_time <= 0 || data.servings_base <= 0) {
            throw new InvalidInputError('Неверные данные для обновления');
        }
        const updated = await this.recipeRepository.update(id, data);
        if (!updated) {
            throw new NotFoundError('Рецепт для обновления не найден');
        }
        return updated;
    }

    async deleteRecipe(id) {
        await this.recipeRepository.delete(id);
    }
}

module.exports = RecipeService;