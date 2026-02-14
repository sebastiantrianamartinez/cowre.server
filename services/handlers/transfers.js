const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class TransferHandler extends BaseHandler {
    constructor() {
        super(models.Transfer, {});
    }

    async createSession(staff, farm, date, remarks = null) {
        const lastSession = await models.Session.findOne({
            where: { table: 'transfers' },
            order: [['id', 'DESC']]
        });

        console.log('Last transfer session:', lastSession?.uuid);
        const uuid = lastSession ? parseInt(lastSession.uuid) + 1 : 1;
        console.log('Creating new transfer session with UUID:', uuid);

        const session = await models.Session.create({
            table: 'transfers',
            uuid,
            staff,
            farm,
            remarks,
            createdAt: date,
            updatedAt: new Date()
        });
        
        return session;
    }

    async getAllSessions() {
        const sessions = await models.Session.findAll({
            where: { table: 'transfers' },
            order: [['id', 'DESC']]
        });

        return sessions;
    }
}

module.exports = TransferHandler;
