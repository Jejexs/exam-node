const sequelize = require('./_database');

const Admin = sequelize.define('Admin', {
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
    password: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Admin