// src/controllers/recipeController.js
const { toRecipeResponse } = require('../dtos');

class RecipeController {
    constructor(recipeService) {
        this.recipeService = recipeService;
    }

    create = async (req, res, next) => {
        try {
            const recipe = await this.recipeService.createRecipe(req.body);
            // По требованию T6: возвращаем 201 и заголовок Location
            res.status(201)
               .location(`/api/v1/recipes/${recipe.id}`)
               .json(toRecipeResponse(recipe));
        } catch (err) {
            next(err); // Передаем ошибку в middleware
        }
    };

    getById = async (req, res, next) => {
        try {
            const recipe = await this.recipeService.getRecipeById(req.params.id);
            res.status(200).json(toRecipeResponse(recipe));
        } catch (err) {
            next(err);
        }
    };

    list = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            const recipes = await this.recipeService.listRecipes(limit, offset);
            res.status(200).json(recipes.map(toRecipeResponse));
        } catch (err) {
            next(err);
        }
    };

    update = async (req, res, next) => {
        try {
            const recipe = await this.recipeService.updateRecipe(req.params.id, req.body);
            res.status(200).json(toRecipeResponse(recipe));
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.recipeService.deleteRecipe(req.params.id);
            res.status(204).send(); // 204 No Content
        } catch (err) {
            next(err);
        }
    };
}

module.exports = RecipeController;