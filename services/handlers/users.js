const BaseHandler = require('./handler');
const { models } = require('../../core/database');
const { Op } = require('sequelize');

class UserHandler extends BaseHandler {
    constructor() {
        super(models.User, {});
    }

    async findByUsername(username) {
        const where = {
            [Op.or]: [
                { username },
                { email: username }
            ]
        };
        
        const user = await this.model.unscoped().findOne({
            where,
            attributes: { include: ['password'] }
        });

        return user;
    }

    async findByRole(role) {
        const users = await this.model.findAll({
            where: { group: role }
        });

        console.log(`Found ${users.length} users with role ${role}`);
        return users;
        
    }

    async search(query, filter) {
        const where = {};

        if (query) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${query}%` } },
                { phone: { [Op.iLike]: `%${query}%` } }
            ];
        }

        if (filter && filter.group) {
            where.group = filter.group;
        }

        const users = await this.model.findAll({ where });
        return users;
    }

    async pseudoDelete(id) {
        console.log(`Attempting to pseudo-delete user with ID: ${id}`);
        const user = await this.model.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        user.status = 0;
        await user.save();
        return user;
    }
}

module.exports = UserHandler;
