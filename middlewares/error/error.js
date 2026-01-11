function errorHandler(err, req, res, next) {
    const isBoom = err?.isBoom;

    if (isBoom) {
        const { statusCode, payload } = err.output;
        console.error('[Boom Error]', err);
        return res.status(statusCode).json(payload);
    }

    // Errores Sequelize por tipo de dato inválido
    if (err?.name === 'SequelizeDatabaseError' && err?.original?.code === '22P02') {
        return res.status(400).json({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Formato inválido para campo tipo entero'
        });
    }

    if (err?.name === 'ValidationError') {
        return res.status(400).json({
            statusCode: 400,
            error: 'Bad Request',
            message: err.message
        });
    }

    const errorCodeMatch = err?.message?.match(/^E\d{3}/);
    if (errorCodeMatch) {
        console.error('[Business Error]', err);
        const code = errorCodeMatch[0];
        const message = err.message.replace(`${code}: `, '');
        return res.status(400).json({
            statusCode: 400,
            error: 'Business Error',
            code,
            message
        });
    }

    console.error('[Unhandled Error]', err);

    return res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Ocurrió un error inesperado',
        details: err.message
    });
}

module.exports = errorHandler;
