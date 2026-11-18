// src/services/userService.js
const { InvalidInputError, NotFoundError } = require('../domain/errors');

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data) {
        // Бизнес-правило 1: Email должен содержать @
        if (!data.email || !data.email.includes('@')) {
            throw new InvalidInputError('Некорректный формат email');
        }
        // Бизнес-правило 2: Роль только author или editor
        if (data.role && !['author', 'editor'].includes(data.role)) {
            throw new InvalidInputError('Роль должна быть author или editor');
        }

        return await this.userRepository.create(data);
    }

    async getUserById(id) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            throw new NotFoundError('Пользователь не найден');
        }
        return user;
    }

    async deleteUser(id) {
        // Проверяем, существует ли пользователь перед удалением
        await this.getUserById(id); 
        await this.userRepository.delete(id);
    }
}

module.exports = UserService;