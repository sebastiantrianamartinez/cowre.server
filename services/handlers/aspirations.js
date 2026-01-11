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

        const session = await models.Session.create({
            staff,
            farm,
            createdAt: date,
            table: 'aspirations',
            uuid: lastSession ? parseInt(lastSession.uuid) + 1 : 1
        });
        
        return session;
    }
}

module.exports = AspirationHandler;
