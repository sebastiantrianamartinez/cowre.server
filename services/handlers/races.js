const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class RaceHandler extends BaseHandler {
    constructor() {
        super(models.Race, {});
    }
}

module.exports = RaceHandler;
