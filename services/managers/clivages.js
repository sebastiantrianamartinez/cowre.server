const { models, sequelize } = require('../../core/database');
const { Op } = require('sequelize');

class ClivageManager {
    constructor() {
        this.Clivage = models.Clivage;
        this.Embryo = models.Embryo;
        this.Aspiration = models.Aspiration;
    }

    async createFromPayload(payload) {
        const transaction = await sequelize.transaction();

        try {
            const { session, lab, clivages } = payload;

            for (const item of clivages) {
                const {
                    aspiration,
                    sperm,
                    embryos,
                    sexed,
                    stages
                } = item;

                // 1. Obtener aspiración (para donor)
                const aspirationDb = await this.Aspiration.findByPk(aspiration, { transaction });
                if (!aspirationDb) {
                    throw new Error(`Aspiration ${aspiration} no encontrada`);
                }

                // 2. Crear clivage
                const clivage = await this.Clivage.create({
                    aspiration: aspiration,
                    sperm: sperm,
                    embryos: embryos,
                    rate: embryos / aspirationDb.viables,
                    type: sexed ? 2 : 1,
                    lab: lab,
                    stages: stages
                }, { transaction });

                // 3. Crear embriones (uno por stage)
                await this.#createEmbryos({
                    clivage,
                    aspiration: aspirationDb,
                    sperm,
                    stages
                }, transaction);
            }

            await transaction.commit();
            return { success: true };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async #createEmbryos({ clivage, aspiration, sperm, stages }, transaction) {
        const stageQualityMap = {
            be: 1,
            bn: 2,
            bx: 3,
            bi: 4,
            bl: 5,
            mo: 6
        };

        const embryosToCreate = [];

        for (const [stage, count] of Object.entries(stages || {})) {
            const qty = Number(count || 0);
            if (qty <= 0) continue;

            for (let i = 0; i < qty; i++) {
                embryosToCreate.push({
                    clivage: clivage.id,
                    aspiration: aspiration.id,
                    donor: aspiration.donor,
                    sperm: sperm,
                    code: this.#generateEmbryoCode(clivage.id, stage, i),
                    quality: stageQualityMap[stage] || 0,
                    stage: stage.toUpperCase(),
                    sex: null,
                    storage: 1
                });
            }
        }

        if (embryosToCreate.length > 0) {
            await this.Embryo.bulkCreate(embryosToCreate, { transaction });
        }
    }

    #generateEmbryoCode(clivageId, stage, index) {
        return `CLV-${clivageId}-${stage.toUpperCase()}-${index + 1}-${Date.now()}`;
    }
}

module.exports = ClivageManager;
