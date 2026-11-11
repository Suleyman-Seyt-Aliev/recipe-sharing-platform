// src/repositories/recipeRepository.js
const { RecipeRepository } = require('./interfaces');
const { Recipe } = require('../domain/models');
const { mapError } = require('./errorMapper');
const { NotFoundError } = require('../domain/errors');

class PostgresRecipeRepository extends RecipeRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async create(recipe) {
        const query = `
            INSERT INTO recipes (title, description, cooking_time, servings_base, status, author_id, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        try {
            const res = await this.pool.query(query, [
                recipe.title, recipe.description, recipe.cooking_time, 
                recipe.servings_base, recipe.status, recipe.author_id, recipe.category_id
            ]);
            return new Recipe(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async getById(id) {
        const query = `SELECT * FROM recipes WHERE id = $1`; // Для себя оставим *, но лучше перечислять поля
        try {
            const res = await this.pool.query(query, [id]);
            if (res.rows.length === 0) throw { code: 'NOT_FOUND' };
            return new Recipe(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async list(limit = 20, offset = 0) {
        const query = `SELECT * FROM recipes ORDER BY created_at DESC, id LIMIT $1 OFFSET $2`;
        try {
            const res = await this.pool.query(query, [limit, offset]);
            return res.rows.map(row => new Recipe(row));
        } catch (err) {
            throw mapError(err);
        }
    }

    async update(id, recipe) {
        const query = `
            UPDATE recipes 
            SET title = $1, description = $2, cooking_time = $3, servings_base = $4, status = $5, category_id = $6
            WHERE id = $7
            RETURNING *
        `;
        try {
            const res = await this.pool.query(query, [
                recipe.title, recipe.description, recipe.cooking_time, 
                recipe.servings_base, recipe.status, recipe.category_id, id
            ]);
            if (res.rowCount === 0) throw new NotFoundError('Рецепт не найден');
            return new Recipe(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async delete(id) {
        const query = `DELETE FROM recipes WHERE id = $1`;
        try {
            const res = await this.pool.query(query, [id]);
            if (res.rowCount === 0) throw new NotFoundError('Рецепт не найден');
        } catch (err) {
            throw mapError(err);
        }
    }
}

module.exports = PostgresRecipeRepository;