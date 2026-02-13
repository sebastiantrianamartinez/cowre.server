const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class ShareHandler extends BaseHandler {
    constructor() {
        super(models.Share, {});
    }
}

module.exports = ShareHandler;
