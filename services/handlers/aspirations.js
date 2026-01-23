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
}

module.exports = AspirationHandler;
