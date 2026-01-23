'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('races', [
            {
                name: 'Gyr',
                description: 'Raza bovina de origen indio, altamente adaptada a climas tropicales y cálidos. Destaca por su buena producción lechera y alta resistencia a enfermedades y estrés térmico.',
            },
            {
                name: 'Girolando',
                description: 'Raza híbrida desarrollada en Brasil a partir del cruce entre Gyr y Holstein. Combina alta producción de leche con gran adaptabilidad a climas tropicales y sistemas extensivos.',
            },
            {
                name: 'Holstein',
                description: 'Raza bovina de origen europeo, reconocida mundialmente por su alta producción lechera. Se adapta mejor a climas templados y sistemas de producción intensiva.',
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('races', {
            name: ['Siberia', 'Praga', 'Girolandia'],
        });
    },
};  