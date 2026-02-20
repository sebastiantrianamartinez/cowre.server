const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class CowHandler extends BaseHandler {
    constructor() {
        super(models.Cow, {});
    }

    async search(query, filter) {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            return [];
        }

        const { Op } = require('sequelize');

        const normalizedQuery = query.trim().replace(/\s+/g, '%');

        const filterConditions = [];
        if (filter && typeof filter === 'object') {
            for (const [key, value] of Object.entries(filter)) {
                if (value === undefined || value === null || value === '') continue;
                filterConditions.push({ [key]: value });
            }
        }

        return await this.model.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { name: { [Op.iLike]: `%${normalizedQuery}%` } },
                            { number: { [Op.iLike]: `%${normalizedQuery}%` } },
                            { register: { [Op.iLike]: `%${normalizedQuery}%` } }
                        ]
                    },
                    ...filterConditions
                ]
            }
        });
    }

    async changeStatus(cowId, status) {
        const cow = await this.model.findByPk(cowId);
        if (!cow) {
            throw new Error('Cow not found');
        }

        cow.status = status;
        await cow.save();

        return cow;
    }

    async moveToFarm(cowId, farmId) {
        const cow = await this.model.findByPk(cowId);
        if (!cow) {
            throw new Error('Cow not found');
        }

        cow.control = farmId;
        await cow.save();

        return cow;
    }
}

module.exports = CowHandler;
