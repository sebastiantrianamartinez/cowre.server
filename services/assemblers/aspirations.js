const { models } = require('./../../core/database/sequelize');
const Aspiration = require('../../data/packages/aspirations');
const sequelize = require('sequelize');

class AspirationsAssembler {
    constructor() {
        this.aspiration = new Aspiration();
        this.models = models; 
    }

    async assembleBySession(sessionId) {
        await this.#loadSession(sessionId);
        const aspirationIds = await this.#loadAspirations(sessionId);
        await this.#loadClivages(aspirationIds);
        await this.#loadTransfers(sessionId);
        return this.aspiration.build();
    }

    async assembleBySessionForPreview(sessionId) {
        await this.#loadSession(sessionId);
        await this.#loadStats(sessionId);
        return this.aspiration.build();
    }

    async #loadSession(sessionId) {
        const session = await this.models.Session.findOne({
            where: { id: sessionId },
            include: [
                { model: this.models.User, as: 'vet' },
                { model: this.models.Farm, as: 'farmData' }
            ]
        });

        this.aspiration.addSession(session);
    }   

    async #loadAspirations(sessionId) {
        const aspirations = await this.models.Aspiration.findAll({
            where: { session: sessionId },
            include: [{ model: this.models.Cow, as: 'cow' }]
        });

        const aspirationIds = aspirations.map(a => a.id);
        this.aspiration.addAspirations(aspirations);

        return aspirationIds;
    }

    async #loadStats(sessionId) {
        const totalAspirations = await this.models.Aspiration.count({
            where: { session: sessionId }
        });

        this.aspiration.addStats({ totalAspirations });
    }   

    async #loadClivages(aspirationIds) {
        const clivages = await this.models.Clivage.findAll({
            where: {
                aspiration: {
                    [sequelize.Op.in]: aspirationIds
                }
            },
            include: [{ model: this.models.Cow, as: 'cow' }]
        });

        this.aspiration.addClivages(clivages);
    }

    async #loadTransfers(opuId) {
        console.log('Loading transfers for OPUSession:', opuId);
        const transfers = await this.models.Transfer.findAll({
            where: { opu: opuId },
            include: [
                {
                    model: this.models.Embryo,
                    as: 'embryoData'
                }
            ],
            order: [['index', 'ASC']]
        });

        this.aspiration.addTransfers(transfers);
    }

}

module.exports = AspirationsAssembler;