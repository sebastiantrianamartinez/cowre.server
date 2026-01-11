const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class TransferHandler extends BaseHandler {
    constructor() {
        super(models.Transfer, {});
    }
}

module.exports = TransferHandler;
