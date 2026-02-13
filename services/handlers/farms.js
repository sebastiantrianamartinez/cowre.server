const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class FarmHandler extends BaseHandler {
    constructor() {
        super(models.Farm, {});
    }

    async search(query) {
        if(!query || typeof query !== 'string' || query.trim() === '') {
            return [];
        }
        const { Op } = require('sequelize');
        
        const normalizedQuery = query.trim().replace(/\s+/g, '%');
        
        return await this.model.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${normalizedQuery}%` } },
                    { remarks: { [Op.iLike]: `%${normalizedQuery}%` } }
                ]
            }
        });
    }

    async searchByOwner(ownerId, query) {
        if(!query || typeof query !== 'string' || query.trim() === '') {
            return [];
        }
        const { Op } = require('sequelize');
        
        const normalizedQuery = query.trim().replace(/\s+/g, '%');
        
        return await this.model.findAll({
            where: {
                owner: ownerId,
                [Op.or]: [
                    { name: { [Op.iLike]: `%${normalizedQuery}%` } },
                    { remarks: { [Op.iLike]: `%${normalizedQuery}%` } }
                ]
            }
        });
    }

    async findByOwner(ownerId) {
        return await this.model.findAll({
            where: {
                owner: ownerId
            }
        });
    }
}

module.exports = FarmHandler;
