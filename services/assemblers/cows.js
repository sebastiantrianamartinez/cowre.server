const { models } = require('./../../core/database/sequelize');
const Cow = require('../../data/packages/cows');;
const sequelize = require('sequelize');

class CowsAssembler {
    constructor() {
        this.cow = new Cow();
        this.models = models; 
    }

    async assembleById(cowId) {
        await this.#loadCow(cowId);
        return this.cow.build();
    }

    async #loadCow(cowId) {
        const cow = await this.models.Cow.findOne({
            where: { id: cowId },
            include: [
                { model: this.models.Farm, as: 'farm' },
                { model: this.models.Race, as: 'race' }
            ]
        });
    }
}

module.exports = CowsAssembler;