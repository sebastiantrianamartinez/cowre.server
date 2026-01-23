'use strict';

const TABLE = 'users';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            TABLE,
            [
                {
                    id: 10,
                    name: 'Ganaderia Manantiales',
                    username: 'manantiales',
                    email: 'manantiales@manantiales.app',
                    password: null,
                    group: 4,
                    status: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 1,
                    name: 'Sebastian Triana',
                    username: 'trianametria',
                    email: 'trianametria@gmail.com',
                    password: '$2a$12$0SjF5bJMIcPNLPHCchdlheVCKNaXeu4F1EKDeZ4UKfSNOtBxJEnzm',
                    group: 1,
                    status: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: 'Cristian Ospina',
                    username: 'cristian.ospina',
                    email: 'cristian@gmail.com',
                    password: '$2a$12$Z4CnxAqmBrDKKq3/ZWmvoOmTJqrleVcvWbdwuBLs9ohDIhS.Nxg12',
                    group: 4,
                    status: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(TABLE, {
            username: [
                'manantiales',
                'trianametria',
                'cristian.ospina',
            ],
        });
    },
};
