const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product } = require('../models');

const { Tag } = require('../models');



// Route pour afficher la liste des produits ( ajouter product?numerodelapage pour accéder à la page souhaitée)

const { Op } = require('sequelize');

router.get('/', async function (req, res) {
    const limit = req.query.limit || 5; // nombre d'éléments par page
    const page = req.query.page || 1; // numéro de la page
    const offset = (page - 1) * limit; // index du premier élément à récupérer
    const products = await Product.findAll({
        attributes: ['title', 'price'],
        where: {
            stock: {
                [Op.gt]: 0 // Affiche les produits dont le stock est supérieur à 0
            }
        },
        include: [{
            model: Tag,
            attributes: ['name'],
            through: { attributes: [] } // N'affiche que le nom du tag
        }],
        limit: limit,
        offset: offset
    });
    res.json(products);
});


// Route pour afficher un produit en particulier (ajouter product/IDproduit pour accéder au produit souhaité)

router.get('/:id', async function (req, res) {
    const product = await Product.findByPk(req.params.id, {
        attributes: ['title', 'price', 'description']
    });
    res.json(product);
});


// Route pour afficher les produits d'une catégorie (tags) (ajouter product/tag/tagduproduit pour accéder à la catégorie souhaitée)

// router.get('/tag/:tag', async function (req, res) {
//     const products = await Product.findAll({
//         attributes: ['title', 'price', 'tags'],
//         where: {
//             tags: {
//                 [Op.like]: `%${req.params.tag}%` // Affiche les produits dont les tags contiennent le tag recherché
//             }
//         }
//     });
//     res.json(products);
// });


module.exports = router;