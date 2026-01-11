'use strict';

const fs = require('fs');
const path = require('path');

/**
 * =========================
 * CONFIGURACIÓN
 * =========================
 */
const CSV_PATH = path.join(__dirname, 'docs', 'donors.csv');

const RACE_MAP = {
    GYR: 1,
};

/**
 * =========================
 * UTILIDADES
 * =========================
 */
const clean = (v) => {
    if (v === undefined || v === null) return null;
    const t = String(v).trim();
    return t.length ? t : null;
};

const parseCSV = () => {
    const raw = fs.readFileSync(CSV_PATH, 'utf8');

    const lines = raw
        .split('\n')
        .map(l => l.replace('\r', '').trim())
        .filter(Boolean);

    if (lines.length < 2) return [];

    const headers = lines[0].split(';').map(h => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';');
        const row = {};

        headers.forEach((h, idx) => {
            row[h] = clean(values[idx]);
        });

        rows.push(row);
    }

    return rows;
};

/**
 * =========================
 * FASE 1 – CREAR VACAS
 * =========================
 */
const seedCows = async (queryInterface, rows) => {
    console.log('🐄 FASE 1: creando vacas');

    const [existing] = await queryInterface.sequelize.query(
        'SELECT id, number FROM cows'
    );

    const cowCache = new Map();
    existing.forEach(c => cowCache.set(c.number, c.id));

    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
        try {
            const { number, name, race, register } = rows[i];

            // Reglas mínimas
            if (!number || !name || !race || !RACE_MAP[race]) {
                skipped++;
                continue;
            }

            if (cowCache.has(number)) {
                skipped++;
                continue;
            }

            const [result] = await queryInterface.bulkInsert(
                'cows',
                [{
                    number,
                    name,
                    register,
                    race: RACE_MAP[race],
                    sex: 1,
                    status: 2,
                    control: 0,
                    role: 0,
                    created_at: new Date(),
                    updated_at: new Date(),
                }],
                { returning: ['id'] }
            );

            cowCache.set(number, result.id);
            inserted++;

        } catch (e) {
            console.error(`❌ FASE 1 – error en fila CSV ${i + 2}`);
            console.error(rows[i]);
            console.error(e.message);
        }
    }

    console.log(`✅ Vacas insertadas: ${inserted}`);
    console.log(`⏭️ Vacas ignoradas: ${skipped}`);
};

/**
 * =========================
 * FASE 2 – CREAR GENEALOGÍAS
 * =========================
 */
const seedGenealogies = async (queryInterface, rows) => {
    console.log('🧬 FASE 2: creando genealogías');

    const [cows] = await queryInterface.sequelize.query(
        'SELECT id, number, name FROM cows'
    );

    const byNumber = new Map();
    const byName = new Map();

    cows.forEach(c => {
        if (c.number) byNumber.set(c.number, c.id);
        if (c.name) byName.set(c.name, c.id);
    });

    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
        try {
            const { number, father, mother } = rows[i];

            if (!number || !byNumber.has(number)) {
                skipped++;
                continue;
            }

            const cowId = byNumber.get(number);
            const fatherId = father ? byName.get(father) : null;
            const motherId = mother ? byName.get(mother) : null;

            if (!fatherId && !motherId) {
                skipped++;
                continue;
            }

            await queryInterface.bulkInsert(
                'genealogies',
                [{
                    cow: cowId,
                    father: fatherId || null,
                    mother: motherId || null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }]
            );

            inserted++;

        } catch (e) {
            console.error(`❌ FASE 2 – error en fila CSV ${i + 2}`);
            console.error(rows[i]);
            console.error(e.message);
        }
    }

    console.log(`✅ Genealogías insertadas: ${inserted}`);
    console.log(`⏭️ Genealogías ignoradas: ${skipped}`);
};

/**
 * =========================
 * SEEDER PRINCIPAL
 * =========================
 */
module.exports = {
    async up(queryInterface) {
        try {
            console.log('📥 Parseando CSV de donadoras...');
            const rows = parseCSV();
            console.log(`📊 Filas CSV: ${rows.length}`);

            await seedCows(queryInterface, rows);
            await seedGenealogies(queryInterface, rows);

            console.log('🎉 Seeder donors finalizado correctamente');

        } catch (fatal) {
            console.error('🔥 ERROR FATAL EN SEEDER');
            console.error(fatal.message);
            console.error(fatal.stack);
            throw fatal;
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('genealogies', null, {});
        await queryInterface.bulkDelete('cows', null, {});
    }
};
