const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class PregnancyHandler extends BaseHandler {
    constructor() {
        super(models.Pregnancy, {});
    }
}

module.exports = PregnancyHandler;
