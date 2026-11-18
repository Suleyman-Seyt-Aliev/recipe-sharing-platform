// src/middlewares/errorHandler.js
const { 
    NotFoundError, 
    InvalidInputError, 
    AlreadyExistsError, 
    ConflictError 
} = require('../domain/errors');

function errorHandler(err, req, res, next) {
    // Если ошибка уже имеет статус (например, от Express), используем его
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof InvalidInputError) {
        return res.status(400).json({ error: err.message }); // Bad Request
    }
    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message }); // Not Found
    }
    if (err instanceof AlreadyExistsError || err instanceof ConflictError) {
        return res.status(409).json({ error: err.message }); // Conflict
    }

    // Любая другая непредвиденная ошибка (например, база упала)
    console.error('Непредвиденная ошибка:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;