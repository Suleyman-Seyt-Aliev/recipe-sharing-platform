// src/domain/errors.js

class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class NotFoundError extends DomainError {}
class AlreadyExistsError extends DomainError {}
class ConflictError extends DomainError {}
class InvalidInputError extends DomainError {}

module.exports = {
    DomainError,
    NotFoundError,
    AlreadyExistsError,
    ConflictError,
    InvalidInputError
};