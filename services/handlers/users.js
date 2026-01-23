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
}

module.exports = UserHandler;
