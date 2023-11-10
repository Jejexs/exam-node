const sequelize = require('./_database');

const Customer = sequelize.define('Customer', {
    firstname: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: sequelize.Sequelize.TEXT,
        allowNull: false
    },
    phone: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false
    },
    password: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Customer