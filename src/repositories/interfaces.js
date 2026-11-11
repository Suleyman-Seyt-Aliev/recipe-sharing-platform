// src/repositories/interfaces.js

// Базовый класс (просто для напоминания)
class BaseRepository {
    async create(entity) { throw new Error("Метод create не реализован"); }
    async getById(id) { throw new Error("Метод getById не реализован"); }
    async list(limit, offset) { throw new Error("Метод list не реализован"); }
    async delete(id) { throw new Error("Метод delete не реализован"); }
}

// 1. Интерфейс для Пользователей (по методичке нужен GetByEmail)
class UserRepository extends BaseRepository {
    async getByEmail(email) { throw new Error("Метод getByEmail не реализован"); }
}

// 2. Интерфейс для Рецептов (по методичке нужен Update)
class RecipeRepository extends BaseRepository {
    async update(id, entity) { throw new Error("Метод update не реализован"); }
}

// 3. Интерфейс для Ингредиентов
class IngredientRepository extends BaseRepository {}

module.exports = {
    UserRepository,
    RecipeRepository,
    IngredientRepository
};