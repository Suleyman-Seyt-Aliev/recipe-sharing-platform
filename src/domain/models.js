// src/domain/models.js

// Модель Пользователя
class User {
    constructor({ id, email, password_hash, role, created_at }) {
        this.id = id;
        this.email = email;
        // Внимание: хеш пароля мы не должны отдавать клиенту, 
        // об этом позаботится контроллер позже (пометим как скрытое поле).
        this.password_hash = password_hash; 
        this.role = role;
        this.created_at = created_at;
    }
}

// Модель Рецепта
class Recipe {
    constructor({ id, title, description, cooking_time, servings_base, status, author_id, category_id, created_at }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.cooking_time = cooking_time;
        this.servings_base = servings_base;
        this.status = status;
        this.author_id = author_id;
        this.category_id = category_id;
        this.created_at = created_at;
    }
}

// Модель Ингредиента
class Ingredient {
    constructor({ id, name, unit, created_at }) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.created_at = created_at;
    }
}

module.exports = {
    User,
    Recipe,
    Ingredient
};