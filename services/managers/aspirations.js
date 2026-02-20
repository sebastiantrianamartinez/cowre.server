const { models } = require("../../core/database");
const AspirationsAssembler = require("../../services/assemblers/aspirations");

class AspirationManager {
	constructor() {
		this.model = models.Aspiration;
		this.assembler = new AspirationsAssembler();
	}

	async saveOrUpdate(session, aspirationData) {
		try {
			const existing = await this.model.findAll({
				where: { session: session.id },
			});

			const existingMap = new Map(existing.map((a) => [a.id, a]));

			const incomingIds = aspirationData.filter((a) => a.id).map((a) => a.id);

			for (const dbAspiration of existing) {
				if (!incomingIds.includes(dbAspiration.id)) {
					await dbAspiration.destroy();
				}
			}

			for (const aspiration of aspirationData) {
				if (aspiration.id && existingMap.has(aspiration.id)) {
					await existingMap.get(aspiration.id).update({
						donor: aspiration.donor,
						oocytes: aspiration.oocytes,
						viables: aspiration.viables,
						remarks: aspiration.remarks,
					});
				} else {
					await this.model.create({
						session: session.id,
						donor: aspiration.donor,
						oocytes: aspiration.oocytes,
						viables: aspiration.viables,
						remarks: aspiration.remarks,
						date: aspiration.date || new Date(),
					});
				}
			}
		} catch (error) {
			console.error("Error saving/updating aspirations:", error);
			throw error;
		}
	}
}

module.exports = AspirationManager;
