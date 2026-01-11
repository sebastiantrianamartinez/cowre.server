const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const modelsDir = path.join(__dirname, '../../data/models');

function scanModels(dir) {
    const models = [];
    function scan(subDir) {
        fs.readdirSync(subDir).forEach(item => {
            const fullPath = path.join(subDir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith('.js') && item !== 'index.js') {
                models.push(fullPath);
            }
        });
    }
    scan(dir);
    return models;
}

function extractModelAndSchema(moduleExport) {
    let Model = null;
    let Schema = null;
    let TABLE = null;

    for (const key in moduleExport) {
        const value = moduleExport[key];

        if (typeof value === 'function' && value.prototype instanceof Sequelize.Model) {
            Model = value;
        }
        if (key.toLowerCase().endsWith('schema')) {
            Schema = value;
        }
        if (key === 'TABLE') {
            TABLE = value;
        }
    }

    return { Model, Schema, TABLE };
}

async function runMigrations(sequelize, direction = 'up') {
    const queryInterface = sequelize.getQueryInterface();
    const modelFiles = scanModels(modelsDir);

    let createdCount = 0;
    let skippedCount = 0;

    for (const file of modelFiles) {
        const moduleExport = require(file);
        const { Model, Schema, TABLE } = extractModelAndSchema(moduleExport);

        if (!Model || !Schema) {
            console.log(`Skipping ${path.relative(modelsDir, file)} (no Model or Schema export)`);
            continue;
        }

        const tableName = TABLE || Model.tableName || Model.name.toLowerCase() + 's';

        if (direction === 'up') {
            const tables = await queryInterface.showAllTables();

            if (!tables.includes(tableName)) {
                await queryInterface.createTable(tableName, Schema);
                console.log(`Created table: ${tableName}`);
                createdCount++;
            } else {
                console.log(`Skipped existing table: ${tableName}`);
                skippedCount++;
            }

        } else if (direction === 'down') {
            await queryInterface.dropTable(tableName);
            console.log(`Dropped table: ${tableName}`);
        }
    }

    console.log('----------------------------------');
    console.log(`Total tablas creadas: ${createdCount}`);
    console.log(`Total tablas saltadas: ${skippedCount}`);
    console.log('----------------------------------');
}

if (require.main === module) {
    const direction = process.argv[2] || 'up';
    const sequelize = require('../core/database/sequelize');
    runMigrations(sequelize, direction)
        .then(() => {
            console.log(`Migraciones completadas (${direction})`);
            process.exit(0);
        })
        .catch(err => {
            console.error('Error ejecutando migraciones:', err);
            process.exit(1);
        });
}

module.exports = runMigrations;
