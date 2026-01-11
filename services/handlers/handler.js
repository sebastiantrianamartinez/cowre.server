const boom = require('@hapi/boom');

class BaseHandler {
    constructor(model, schemas = {}) {
        this.model = model;
        this.schemas = schemas;
    }

    validate(schemaName, data) {
        const schema = this.schemas[schemaName];
        if (!schema) return data;
        const { error, value } = schema.validate(data);
        if (error) throw boom.badRequest(error.message);
        return value;
    }

    async create(data) {
        const value = this.validate('create', data);
        try {
            const created = await this.model.create(value);
            return this._sanitize(created);
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    async update(data) {
        const value = this.validate('update', data);
        try {
            return await this.model.update(value, { where: { id: value.id } });
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    async findActive(){
        return this.model.findAll({ where: { status: 2 } });
    }

    async findOneBy(where) {
        try {
            const found = await this.model.findOne({ where });
            return this._sanitize(found);
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    async updateBy(where, data) {
        try {
            return await this.model.update(data, { where });
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    async findAll(limit = null, offset = null) {
        try {
            const options = {};
            if (limit != null) options.limit = limit;
            if (offset != null) options.offset = offset;
            const list = await this.model.findAll(options);
            return this._sanitize(list);
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    async upsert(data, where) {
        try {
            const [instance, created] = await this.model.upsert(
                { ...data, ...where },
                { returning: true }
            );
            return this._sanitize(instance);
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    async findWithPagination(limit, offset, order) {
        try {
            const options = {
                limit: limit,
                offset: offset,
                order: order || [['id', 'ASC']]
            };
            const list = await this.model.findAll(options);
            return this._sanitize(list);
        } catch (error) {
            throw this.processDbError(error);
        }
    }

    _sanitize(entity) {
        if (entity == null) return entity;

        // If Sequelize instance(s), convert to plain object(s)
        const toPlain = (item) => {
            if (item == null) return item;
            if (typeof item.toJSON === 'function') {
                const obj = item.toJSON();
                if (obj && Object.prototype.hasOwnProperty.call(obj, 'password')) {
                    delete obj.password;
                }
                return obj;
            }
            if (Array.isArray(item)) return item.map(toPlain);
            if (typeof item === 'object') {
                const copy = { ...item };
                if (Object.prototype.hasOwnProperty.call(copy, 'password')) delete copy.password;
                return copy;
            }
            return item;
        };

        if (Array.isArray(entity)) return entity.map(toPlain);
        return toPlain(entity);
    }

    processDbError(error) {
        if (error?.name === 'SequelizeValidationError') {
            const message = error.errors?.map(e => `${e.path}: ${e.message}`).join(', ');
            return boom.badRequest(message || 'Error de validación');
        }
    
        if (error?.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors?.[0]?.path;
            return boom.conflict(`Ya existe un registro con el mismo valor en '${field}'`);
        }
    
        if (error?.name === 'SequelizeForeignKeyConstraintError') {
            return boom.badRequest('La clave foránea es inválida o está violando una restricción');
        }
    
        if (error?.name === 'SequelizeDatabaseError') {
            const msg = error?.original?.message?.toLowerCase();
    
            if (msg.includes('null value') && msg.includes('violates not-null constraint')) {
                const match = msg.match(/column "(.*?)"/);
                const field = match ? match[1] : 'desconocido';
                return boom.badRequest(`El campo '${field}' no puede ser nulo`);
            }
    
            return boom.badData(error.original.message);
        }
    
        if (error?.original?.code === 'ECONNREFUSED') {
            return boom.serverUnavailable('No se pudo conectar a la base de datos');
        }
    
        if (error?.original?.code === 'ETIMEDOUT') {
            return boom.serverUnavailable('Tiempo de espera agotado al acceder a la base de datos');
        }
    
        if (error?.original?.detail) {
            return boom.badData(error.original.detail);
        }

        if (error.message && error.message.includes('not found')) {
            return boom.notFound('Recurso no encontrado');
        }
    
        console.error('Error inesperado en base de datos:', error);
        return boom.internal('Error inesperado en base de datos');
    }
    
}

module.exports = BaseHandler;
