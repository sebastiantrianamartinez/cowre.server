const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const projectRoot = path.join(__dirname, '..');
const ModelsDir = path.join(projectRoot, 'data/models');
const outDir = path.join(projectRoot, 'services/handlers');

function scanModelFiles(dir) {
    const files = [];
    function scan(current) {
        fs.readdirSync(current).forEach(item => {
            const full = path.join(current, item);
            const stats = fs.statSync(full);
            if (stats.isDirectory()) {
                scan(full);
            } else if (item.endsWith('.js') && item !== 'index.js') {
                files.push(full);
            }
        });
    }
    scan(dir);
    return files;
}

function extractModelData(moduleExport) {
    for (const key in moduleExport) {
        const value = moduleExport[key];

        if (typeof value === 'function' && value.prototype instanceof Sequelize.Model) {
            const config = typeof value.config === 'function' ? value.config() : null;
            const modelName = config?.modelName || value.name;
            return { modelName };
        }
    }
    return null;
}

function buildHandlerContent(modelFileName, modelName) {
    const handlerClassName = modelName + 'Handler';

    return `
const BaseHandler = require('./handler');
const { models } = require('../../core/database');

class ${handlerClassName} extends BaseHandler {
    constructor() {
        super(models.${modelName}, {});
    }
}

module.exports = ${handlerClassName};
`.trim() + '\n';
}

function generateHandlers() {
    console.log('ModelsDir:', ModelsDir);
    console.log('HandlersDir:', outDir);

    const modelFiles = scanModelFiles(ModelsDir);

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    let created = 0;
    let skipped = 0;

    modelFiles.forEach(file => {
        const exportObj = require(file);
        const data = extractModelData(exportObj);

        if (!data) return;

        const { modelName } = data;

        const modelFileName = path.basename(file, '.js');
        const handlerFile = path.join(outDir, `${modelFileName}.js`);

        if (fs.existsSync(handlerFile)) {
            skipped++;
            return;
        }

        const content = buildHandlerContent(modelFileName, modelName);
        fs.writeFileSync(handlerFile, content);

        console.log('Creado handler:', handlerFile);
        created++;
    });

    console.log(`Handlers creados: ${created}`);
    console.log(`Handlers saltados: ${skipped}`);
}

generateHandlers();
