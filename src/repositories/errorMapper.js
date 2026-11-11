// src/repositories/errorMapper.js
const { 
    NotFoundError, 
    AlreadyExistsError, 
    ConflictError, 
    InvalidInputError 
} = require('../domain/errors');

function mapError(err) {
    if (!err) return null;
    
    // Если запрос ничего не нашел
    if (err.code === 'NOT_FOUND') return new NotFoundError('Ресурс не найден');

    // Коды ошибок PostgreSQL
    switch (err.code) {
        case '23505': // unique_violation
            return new AlreadyExistsError(`Уже существует: ${err.constraint}`);
        case '23503': // foreign_key_violation
            return new ConflictError(`Нарушение связей: ${err.constraint}`);
        case '23514': // check_violation
        case '22P02': // invalid_text_representation
            return new InvalidInputError(`Неверные данные: ${err.message}`);
        default:
            // Если ошибка нам неизвестна, пробрасываем её дальше
            return err;
    }
}

module.exports = { mapError };