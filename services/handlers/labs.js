const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class LabHandler extends BaseHandler {
    constructor() {
        super(models.Lab, {});
    }
}

module.exports = LabHandler;
