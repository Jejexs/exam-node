const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const Customer = require('./Customer');
const Tag = require('./Tag');
const Admin = require('./Admin');


// Déclaration des relations
Product.belongsToMany(Tag, { through: 'ProductTag' });
Tag.belongsToMany(Product, { through: 'ProductTag' });

// Synchronisation de la base
sequelize.sync({ alter: true });


module.exports = {
    Product: Product,
    Customer: Customer,
    Tag: Tag,
    Admin: Admin
}


