const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class SessionHandler extends BaseHandler {
    constructor() {
        super(models.Session, {});
    }
}

module.exports = SessionHandler;
