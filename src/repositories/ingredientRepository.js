// src/repositories/ingredientRepository.js
const { IngredientRepository } = require('./interfaces');
const { Ingredient } = require('../domain/models');
const { mapError } = require('./errorMapper');
const { NotFoundError } = require('../domain/errors');

class PostgresIngredientRepository extends IngredientRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async create(ingredient) {
        const query = `
            INSERT INTO ingredients (name, unit)
            VALUES ($1, $2)
            RETURNING id, name, unit, created_at
        `;
        try {
            const res = await this.pool.query(query, [ingredient.name, ingredient.unit]);
            return new Ingredient(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async getById(id) {
        const query = `SELECT id, name, unit, created_at FROM ingredients WHERE id = $1`;
        try {
            const res = await this.pool.query(query, [id]);
            if (res.rows.length === 0) throw { code: 'NOT_FOUND' };
            return new Ingredient(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async list(limit = 20, offset = 0) {
        const query = `SELECT id, name, unit, created_at FROM ingredients ORDER BY created_at DESC, id LIMIT $1 OFFSET $2`;
        try {
            const res = await this.pool.query(query, [limit, offset]);
            return res.rows.map(row => new Ingredient(row));
        } catch (err) {
            throw mapError(err);
        }
    }

    async delete(id) {
        const query = `DELETE FROM ingredients WHERE id = $1`;
        try {
            const res = await this.pool.query(query, [id]);
            if (res.rowCount === 0) throw new NotFoundError('Ингредиент не найден');
        } catch (err) {
            throw mapError(err);
        }
    }
}

module.exports = PostgresIngredientRepository;