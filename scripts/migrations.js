require('dotenv').config();
const sequelize = require('../core/database/sequelize');
const runMigrations = require('../data/migrations/migrate'); // ruta corregida

const direction = process.argv[2] || 'up';

(async () => {
    try {
        await runMigrations(sequelize, direction);
        console.log(`(o) Migraciones ejecutadas con éxito (${direction})`);
        process.exit(0);
    } catch (err) {
        console.error('(x) Error ejecutando migraciones:', err);
        process.exit(1);
    }
})();
