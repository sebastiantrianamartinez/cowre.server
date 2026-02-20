const BaseHandler = require('./handler');
const { models } = require('../../core/database');

const AspirationsAssembler = require('../../services/assemblers/aspirations');

class AspirationHandler extends BaseHandler {
    constructor() {
        super(models.Aspiration, {});
    }

    async createSession(staff, farm, date) {
        const lastSession = await models.Session.findOne({
            where: { table: 'aspirations' },
            order: [['id', 'DESC']]
        });

        console.log('Last aspiration session:', lastSession?.uuid);

        const uuid = lastSession ? parseInt(lastSession.uuid) + 1 : 1;
        console.log('Creating new aspiration session with UUID:', uuid);

        const session = await models.Session.create({
            table: 'aspirations',
            uuid,
            staff,
            farm,
            createdAt: date,
            updatedAt: new Date()
        });
        
        return session;
    }

    async getAllSessions() {
        const sessions = await models.Session.findAll({
            where: { table: 'aspirations' },
            order: [['id', 'DESC']]
        });

        return sessions;
    }

    async deleteSession(sessionId) {
        const session = await models.Session.findOne({
            where: { table: 'aspirations', uuid: sessionId }
        });

        if (!session) {
            throw new Error('Session not found');
        }

        const aspirations = await this.model.findAll({ where: { session: session.uuid } });
        for (const aspiration of aspirations) {
            await aspiration.destroy();
        }
       
        session.remarks = { deleted: true, deletedAt: new Date() };
        await session.save();

        return true;
    }
}

module.exports = AspirationHandler;
