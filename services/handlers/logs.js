const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class LogHandler extends BaseHandler {
    constructor() {
        super(models.Log, {});
    }
}

module.exports = LogHandler;
