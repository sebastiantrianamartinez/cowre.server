const { models } = require('../../core/database/sequelize');
const sequelize = require('sequelize');
const ClivagePackage = require('../../data/packages/clivages');
const CowsAssembler = require('./cows');

class ClivagesAssembler {
    constructor() {
        this.models = models;
        this.package = new ClivagePackage();
        this.cowsAssembler = new CowsAssembler();
    }

    async assembleForTransfer(sessionId) {
        const session = await this.#loadSession(sessionId);
        const aspirationIds = await this.#loadAspirations(sessionId);
        const clivages = await this.#loadClivages(aspirationIds);

        this.package.addSession(session);
        this.package.addClivages(clivages);

        return this.package.build();
    }

    async #loadSession(sessionId) {
        return this.models.Session.findOne({
            where: { id: sessionId },
            include: [
                {
                    model: this.models.User,
                    as: 'vet',
                    attributes: ['id', 'name'],
                },
                {
                    model: this.models.Farm,
                    as: 'farmData',
                    attributes: ['id', 'name', 'location'],
                },
            ],
        });
    }

    async #loadAspirations(sessionId) {
        const aspirations = await this.models.Aspiration.findAll({
            where: { session: sessionId },
            attributes: ['id'],
        });

        return aspirations.map(a => a.id);
    }

    async #loadClivages(aspirationIds) {
        const clivages = await this.models.Clivage.findAll({
            where: {
                aspiration: {
                    [sequelize.Op.in]: aspirationIds,
                },
            },
            attributes: [
                'id',
                'aspiration',
                'sperm',
                'embryos',
                'stages',
                'remarks',
                'rate',
                'type',
                'lab',
                'createdAt',
            ],
        });

        const aspirations = await this.models.Aspiration.findAll({
            where: {
                id: {
                    [sequelize.Op.in]: aspirationIds,
                },
            },
            attributes: ['id', 'donor'],
        });

        const donorMap = {};
        for (const asp of aspirations) {
            const cowsAssembler = new CowsAssembler();
            if (asp.donor && !donorMap[asp.donor]) {
                donorMap[asp.donor] = await cowsAssembler.assembleForTransfer(
                    asp.donor
                );
            }
        }

        const spermMap = {};
        for (const clivage of clivages) {
            const cowsAssembler = new CowsAssembler();
            if (clivage.sperm && !spermMap[clivage.sperm]) {
                spermMap[clivage.sperm] = await cowsAssembler.assembleForTransfer(
                    clivage.sperm
                );
            }
        }

        const aspirationToDonor = {};
        for (const asp of aspirations) {
            aspirationToDonor[asp.id] = asp.donor
                ? donorMap[asp.donor] || null
                : null;
        }

        return clivages.map(clivage => ({
            id: clivage.id,
            donor: aspirationToDonor[clivage.aspiration] || null,
            sperm: spermMap[clivage.sperm] || null,
            embryos: clivage.embryos,
            stages: clivage.stages,
            remarks: clivage.remarks,
            meta: {
                aspirationId: clivage.aspiration,
                rate: clivage.rate,
                type: clivage.type,
                lab: clivage.lab,
                createdAt: clivage.createdAt,
            },
        }));
    }
}

module.exports = ClivagesAssembler;
