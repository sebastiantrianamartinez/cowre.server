const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class EmbryoHandler extends BaseHandler {
    constructor() {
        super(models.Embryo, {});
    }
}

module.exports = EmbryoHandler;
