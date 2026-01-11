'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('farms', [
            {
                name: 'Manantiales Siberia',
                location: 'https://maps.app.goo.gl/4UXyHGKx6qf1M8NS9',
                owner: 10,
                remarks: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Manantiales Praga',
                location: null,
                owner: 10,
                remarks: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Mananatiales Girolandia',
                location: null,
                owner: 10,
                remarks: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('farms', {
            name: [
                'Manantiales Siberia',
                'Manantiales Praga',
                'Mananatiales Girolandia',
            ],
        });
    },
};
