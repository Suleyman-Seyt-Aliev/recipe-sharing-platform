// src/controllers/userController.js
const { toUserResponse } = require('../dtos');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    create = async (req, res, next) => {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201)
               .location(`/api/v1/users/${user.id}`)
               .json(toUserResponse(user));
        } catch (err) {
            next(err);
        }
    };

    getById = async (req, res, next) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.status(200).json(toUserResponse(user));
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = UserController;