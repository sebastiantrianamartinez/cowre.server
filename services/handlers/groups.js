const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class GroupHandler extends BaseHandler {
    constructor() {
        super(models.Group, {});
    }
}

module.exports = GroupHandler;
