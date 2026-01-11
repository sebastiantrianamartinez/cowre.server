const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class ClivageHandler extends BaseHandler {
    constructor() {
        super(models.Clivage, {});
    }
}

module.exports = ClivageHandler;
