const ExcelJS = require('exceljs');
const Papa = require('papaparse');
const _ = require('lodash');
const fileType = require('file-type');

async function detectFileType(buffer, fallbackName = '') {
    const detected = await fileType.fromBuffer(buffer);
    if (detected) return detected.mime;

    if (fallbackName.endsWith('.xlsx') || fallbackName.endsWith('.xls')) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    if (fallbackName.endsWith('.csv')) return 'text/csv';
    if (fallbackName.endsWith('.txt')) return 'text/plain';

    return 'application/octet-stream';
}

async function parseExcel(buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.worksheets[0];
    const rows = [];

    const headers = [];
    sheet.getRow(1).eachCell((cell) => {
        headers.push(String(cell.text).trim());
    });

    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const item = {};
        row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            item[header] = cell.text;
        });

        rows.push(item);
    });

    return rows;
}

async function parseCSV(buffer, delimiter) {
    const csvString = buffer.toString();

    const result = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        delimiter: delimiter || undefined
    });

    return result.data;
}

function normalizeRows(rows, columnMap = {}) {
    return rows.map((row) => {
        const normalized = {};

        for (const target in columnMap) {
            const candidates = columnMap[target] || [];

            for (const key of candidates) {
                if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                    normalized[target] = row[key];
                    break;
                }
            }
        }

        return normalized;
    });
}

async function readSheet(fileBuffer, filename, options = {}) {
    const mime = await detectFileType(fileBuffer, filename);

    let parsedRows = [];

    if (mime.includes('spreadsheetml') || filename.endsWith('.xlsx')) {
        parsedRows = await parseExcel(fileBuffer);
    } else if (mime.includes('csv') || filename.endsWith('.csv')) {
        parsedRows = await parseCSV(fileBuffer, options.delimiter);
    } else {
        parsedRows = await parseCSV(fileBuffer, options.delimiter);
    }

    const normalized = normalizeRows(parsedRows, options.renameMap || {});

    return normalized.filter(r => Object.keys(r).length > 0);
}

module.exports = {
    readSheet,
    parseExcel,
    parseCSV,
    normalizeRows
};
