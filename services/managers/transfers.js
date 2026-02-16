const sequelize = require('../../core/database/sequelize');
const { models } = require('../../core/database');

class TransferManager {

    constructor() {
        this.Transfer = models.Transfer;
        this.Aspiration = models.Aspiration;
        this.Clivage = models.Clivage;
        this.Embryo = models.Embryo;
    }

    // ============================================================
    // PUBLIC METHOD
    // ============================================================

    async sync(payload) {

        const transaction = await sequelize.transaction();

        try {

            const {
                session,
                opu,
                staff,
                farm,
                date,
                transfers
            } = payload;

            if (!session || !opu || !date) {
                throw new Error('Session, OPU and transfer date are required');
            }

            if (!Array.isArray(transfers)) {
                throw new Error('Invalid transfers payload');
            }

            console.log('Starting transfer sync with payload:', payload);

            // 1️⃣ Obtener todos los embriones ordenados globalmente por OPU
            const embryos = await this.#getOrderedEmbryosByOpu(opu, transaction);

            if (!embryos.length) {
                throw new Error('No embryos found for this OPU');
            }

            // 2️⃣ Traer transfers existentes
            const existingTransfers = await this.Transfer.findAll({
                where: { opu },
                transaction
            });


            const existingMap = new Map(
                existingTransfers.map(t => [t.index, t]) 
            );

            const processedIndexes = [];
            let applied = 0;

            // 3️⃣ Procesar cada transferencia enviada
            for (const t of transfers) {

                if (!t.recipient || t.recipient.trim() === '') {
                    continue;
                }

                const index = Number(t.index);

                if (!Number.isInteger(index) || index < 1) {
                    continue;
                }

                const embryo = embryos[index - 1];

                if (!embryo) {
                    console.log(`No embryo found for index ${index}`);
                    continue;
                }

                processedIndexes.push(index);

                const reproductiveDates = this.#calculateReproductiveDates(date);

                const data = {
                    session,
                    opu,
                    index,
                    embryo: embryo.id,
                    recipient: t.recipient.trim(),
                    date: new Date(date),
                    vet: staff,
                    place: farm,
                    status: this.#calculateStatus(t),
                    remarks: t.remarks || null,
                    dx1: t.dx1 || null,
                    dx2: t.dx2 || null,
                    dx1_date: reproductiveDates.dx1_date,
                    dx2_date: reproductiveDates.dx2_date,
                    due_date: reproductiveDates.due_date
                };

                if (existingMap.has(index)) {
                    await existingMap.get(index).update(data, { transaction });
                } else {
                    await this.Transfer.create(data, { transaction });
                }

                applied++;
            }

            // 4️⃣ Eliminar transfers que ya no existen en el payload
            for (const existing of existingTransfers) {
                if (!processedIndexes.includes(existing.index)) {
                    await existing.destroy({ transaction });
                }
            }

            await transaction.commit();

            return {
                success: true,
                applied
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error syncing transfers:', error);
            throw error;
        }
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    async #getOrderedEmbryosByOpu(opuId, transaction) {

        // 1️⃣ Aspirations
        const aspirations = await this.Aspiration.findAll({
            where: { session: opuId },
            attributes: ['id'],
            order: [['id', 'ASC']],
            transaction
        });

        const aspirationIds = aspirations.map(a => a.id);
        if (!aspirationIds.length) return [];

        // 2️⃣ Clivages
        const clivages = await this.Clivage.findAll({
            where: { aspiration: aspirationIds },
            attributes: ['id'],
            order: [['id', 'ASC']],
            transaction
        });

        const clivageIds = clivages.map(c => c.id);
        if (!clivageIds.length) return [];

        // 3️⃣ Embriones ordenados globalmente
        const embryos = await this.Embryo.findAll({
            where: { clivage: clivageIds },
            order: [
                ['clivage', 'ASC'],
                ['id', 'ASC']
            ],
            transaction
        });

        return embryos;
    }

    #calculateReproductiveDates(transferDate) {

        const base = new Date(transferDate);

        if (isNaN(base.getTime())) {
            throw new Error('Invalid transfer date');
        }

        const addDays = (days) => {
            const d = new Date(base);
            d.setDate(d.getDate() + days);
            return d;
        };

        return {
            dx1_date: addDays(30),
            dx2_date: addDays(60),
            due_date: addDays(280)
        };
    }

    #calculateStatus(t) {

        if (t.dx1 === 'V' || t.dx2 === 'V') {
            return 2; // Fallido
        }

        if (t.dx1 === 'P') {
            return 1; // Confirmado provisional
        }

        return t.status || 0; // Pendiente
    }
}

module.exports = TransferManager;
