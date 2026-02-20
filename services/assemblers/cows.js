const { models } = require('./../../core/database/sequelize');
const Cow = require('../../data/packages/cows');;
const sequelize = require('sequelize');

class CowsAssembler {
    constructor() {
        this.cow = new Cow();
        this.models = models; 
    }

    async assembleForTransfer(cowId) {
        await this.#loadCow(cowId);
        return this.cow.build();
    }

    async assembleForShares(cowId) {
        const cow = await this.#loadCow(cowId);
        await this.#loadShares(cowId);
        await this.#loadFarms(cow);
        return this.cow.build();
    }

    async assembleById(cowId) {
        const cow = await this.#loadCow(cowId);
        await this.#loadStats(cowId);
        await this.#loadShares(cowId);
        await this.#loadFarms(cow);   
        return this.cow.build();
    }

    async #loadCow(cowId) {
        const cow = await this.models.Cow.findOne({
            where: { id: cowId },
            include: [
                { model: this.models.Race, as: 'raceData' }
            ]
        });

        this.cow.addCow(cow);
        return cow;
    }

    async #loadStats(cowId, startDate = null, endDate = null) {
        const where = { donor: cowId };

        if (startDate && endDate) {
            where.date = {
                [sequelize.Op.between]: [startDate, endDate],
            };
        }

        const aspirations = await this.models.Aspiration.findAll({
            where,
            order: [['date', 'ASC']],
            raw: true,
        });

        if (!aspirations.length) {
            this.cow.addStats({
                aspirations: {
                    totalSessions: 0,
                },
            });
            return;
        }

        const totalSessions = aspirations.length;

        const totalOocytes = aspirations.reduce(
            (sum, a) => sum + (a.oocytes || 0),
            0
        );

        const totalViableEmbryos = aspirations.reduce(
            (sum, a) => sum + (a.viables || 0),
            0
        );

        const averageOocytesPerSession = totalOocytes / totalSessions;
        const averageViablesPerSession = totalViableEmbryos / totalSessions;

        const viabilityRate =
            totalOocytes > 0 ? (totalViableEmbryos / totalOocytes) * 100 : 0;

        const firstAspirationDate = aspirations[0].date;
        const lastAspirationDate = aspirations[aspirations.length - 1].date;

        const daysSinceLastAspiration = Math.floor(
            (Date.now() - new Date(lastAspirationDate)) / (1000 * 60 * 60 * 24)
        );

        let totalDaysBetweenSessions = 0;

        for (let i = 1; i < aspirations.length; i++) {
            const previous = new Date(aspirations[i - 1].date);
            const current = new Date(aspirations[i].date);
            totalDaysBetweenSessions +=
                (current - previous) / (1000 * 60 * 60 * 24);
        }

        const averageDaysBetweenSessions =
            totalSessions > 1
                ? totalDaysBetweenSessions / (totalSessions - 1)
                : 0;

        const bestSessionViables = Math.max(
            ...aspirations.map(a => a.viables)
        );

        const worstSessionViables = Math.min(
            ...aspirations.map(a => a.viables)
        );

        const sessionsWithZeroViables = aspirations.filter(
            a => a.viables === 0
        ).length;

        const averageEfficiency =
            aspirations.reduce((sum, a) => {
                if (a.oocytes > 0) {
                    sum += a.viables / a.oocytes;
                }
                return sum;
            }, 0) / totalSessions;

        this.cow.addStats({
            aspirations: {
                totalSessions,
                totalOocytes,
                totalViableEmbryos,
                averageOocytesPerSession: averageOocytesPerSession.toFixed(2),
                averageViablesPerSession: averageViablesPerSession.toFixed(2),
                viabilityRate,
                daysSinceLastAspiration,
                firstAspirationDate,
                lastAspirationDate,
                averageDaysBetweenSessions: averageDaysBetweenSessions.toFixed(2),
                bestSessionViables,
                worstSessionViables,
                sessionsWithZeroViables,
                averageEfficiency: averageEfficiency.toFixed(2),
            },
        });
    }

    async #loadShares(cowId) {
        const shares = await this.models.Share.findAll({
            where: { cow: cowId },
            include: [
                {
                    model: this.models.User,
                    as: 'ownerData',
                    attributes: ['id', 'name']
                }
            ]
        });

        this.cow.addShares(shares);
    }

    async #loadFarms(cow) {
        const farmId = cow.control;

        if (farmId && farmId > 0) {
            const farm = await this.models.Farm.findByPk(farmId);
            this.cow.addFarm(farm);
        }
    }

}

module.exports = CowsAssembler;