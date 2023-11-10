const sequelize = require('./_database');

const Tag = sequelize.define('Tag', {
    name: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Tag