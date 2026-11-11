// src/repositories/userRepository.js
const { UserRepository } = require('./interfaces');
const { User } = require('../domain/models');
const { mapError } = require('./errorMapper');
const { NotFoundError } = require('../domain/errors');

class PostgresUserRepository extends UserRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async create(user) {
        // Возвращаем id и created_at, которые сгенерировала база
        const query = `
            INSERT INTO users (email, password_hash, role)
            VALUES ($1, $2, $3)
            RETURNING id, email, password_hash, role, created_at
        `;
        try {
            const res = await this.pool.query(query, [user.email, user.password_hash, user.role]);
            return new User(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async getById(id) {
        const query = `SELECT id, email, password_hash, role, created_at FROM users WHERE id = $1`;
        try {
            const res = await this.pool.query(query, [id]);
            if (res.rows.length === 0) throw { code: 'NOT_FOUND' }; // Имитируем ошибку для маппера
            return new User(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async getByEmail(email) {
        // Защита от SQL-инъекций: $1
        const query = `SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1`;
        try {
            const res = await this.pool.query(query, [email]);
            if (res.rows.length === 0) throw { code: 'NOT_FOUND' };
            return new User(res.rows[0]);
        } catch (err) {
            throw mapError(err);
        }
    }

    async list(limit = 20, offset = 0) {
        const query = `
            SELECT id, email, password_hash, role, created_at 
            FROM users 
            ORDER BY created_at DESC, id 
            LIMIT $1 OFFSET $2
        `;
        try {
            const res = await this.pool.query(query, [limit, offset]);
            return res.rows.map(row => new User(row));
        } catch (err) {
            throw mapError(err);
        }
    }

    async delete(id) {
        const query = `DELETE FROM users WHERE id = $1`;
        try {
            const res = await this.pool.query(query, [id]);
            // Проверка количества затронутых строк (RowsAffected)
            if (res.rowCount === 0) throw new NotFoundError('Пользователь не найден');
        } catch (err) {
            throw mapError(err);
        }
    }
}

module.exports = PostgresUserRepository;