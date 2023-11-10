const sequelize = require('./_database');

const Product = sequelize.define('Product', {
    title: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: sequelize.Sequelize.TEXT,
        allowNull: false
    },
    stock: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false
    }

})

module.exports = Product