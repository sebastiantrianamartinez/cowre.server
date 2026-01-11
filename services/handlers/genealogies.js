const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class GenealogyHandler extends BaseHandler {
    constructor() {
        super(models.Genealogy, {});
    }
}

module.exports = GenealogyHandler;
