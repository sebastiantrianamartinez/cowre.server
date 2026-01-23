'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('groups', [
            {
                id: 1,
                name: 'Admin',
                description: 'Administradores del sistema con permisos completos.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 5,
                name: 'Veterinario',
                description: 'Usuarios encargados del cuidado y salud de los animales.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 6,
                name: 'Empleado',
                description: 'Usuarios con permisos limitados para tareas diarias.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 7,
                name: 'Cliente',
                description: 'Usuarios que son clientes del sistema.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('groups', {
            name: ['Admin', 'Veterinario', 'Empleado', 'Cliente'],
        });
    }
};