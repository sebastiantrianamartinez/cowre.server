const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../../data/models');

function scan(dir) {
    const exportsArray = [];
    fs.readdirSync(dir).forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            exportsArray.push(...scan(fullPath));
        } else if (item.endsWith('.js') && item !== 'index.js') {
            exportsArray.push(require(fullPath));
        }
    });
    return exportsArray;
}

module.exports = scan(modelsDir);
