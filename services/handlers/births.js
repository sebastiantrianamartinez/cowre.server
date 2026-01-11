const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class BirthHandler extends BaseHandler {
    constructor() {
        super(models.Birth, {});
    }
}

module.exports = BirthHandler;
