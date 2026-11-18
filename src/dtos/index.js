// src/dtos/index.js

// Преобразование Пользователя
function toUserResponse(user) {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
    };
}

// Преобразование Рецепта
function toRecipeResponse(recipe) {
    return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        cooking_time: recipe.cooking_time,
        servings_base: recipe.servings_base,
        status: recipe.status,
        author_id: recipe.author_id,
        category_id: recipe.category_id,
        created_at: recipe.created_at
    };
}

module.exports = { toUserResponse, toRecipeResponse };