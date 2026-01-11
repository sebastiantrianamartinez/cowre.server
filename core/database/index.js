const sequelize = require('./sequelize');
const modules = require('./models');

const models = {};

for (const exported of modules) {
    const Model = Object.values(exported).find(
        v => typeof v?.init === 'function' && typeof v?.config === 'function'
    );
    const schemaKey = Object.keys(exported).find(k => k.toLowerCase().endsWith('schema'));
    const schema = schemaKey ? exported[schemaKey] : null;

    if (!Model || !schema) {
        continue;
    }

    Model.init(schema, Model.config(sequelize));
    models[Model.name] = Model;
}

for (const modelName of Object.keys(models)) {
  const model = models[modelName];
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
}

module.exports = { sequelize, models };
