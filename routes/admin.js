const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const { Customer } = require('../models');

const { Tag } = require('../models');

const { Product } = require('../models');

const { Admin } = require('../models');

const { Op } = require('sequelize');

const { route } = require('./product');


const middleware = require('../middleware');

router.use(middleware.adminMiddleware);

function generateToken2(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET2);
}



// Route pour que l'administrateur accéde à la liste des produits

router.get('/product', async function (req, res) {
    const products = await Product.findAll({
        include: Tag
    });
    res.json(products);
});

// Route pour que l'administrateur puisse supprimer un produit

router.delete('/product-delete/:id', async function (req, res) {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    res.json({ message: 'Produit supprimé' });
});


// Route pour que l'administrateur puisse modifier un produit

router.patch('/product-update/:id', async function (req, res) {
    const product = await Product.findByPk(req.params.id);
    await product.update(req.body);
    res.json({ message: 'Produit modifié' });
});

// Route pour que l'administrateur puisse ajouter un produit

router.post('/product-create', async function (req, res) {

    try {
        const { title, description, price, stock, tags } = req.body;

        // vérifiez si tous les tags existent

        const existingTags = await Tag.findAll({
            where: {
                name: tags
            }
        });

        // Si la longueur des tags existant n'est pas égale à la longueur des tags fournis, alors au moins un tag n'existe pas
        if (existingTags.length !== tags.length) {
            return res.status(400).json({ error: 'Au moins un tag n\'existe pas' });
        }

        const product = await Product.create({ title, description, price, stock });

        // Associez les tags existant au produit
        await product.addTags(existingTags);

        res.json(product);
    } catch (error) {
        res.status(400).json({ error: 'Erreur à la création du produit' });
    }
});



// Route pour que l'administrateur accéde a la liste des clients

router.get('/customer', async function (req, res) {
    const customers = await Customer.findAll();
    res.json(customers);
});

// Route pour que l'administrateur créé un tags

router.post('/tag-create', async function (req, res) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Name field is required' });
    }
    const tag = await Tag.create(req.body);
    res.json({ message: 'Tag créé' });
});


// Permettre aux administrateurs existant de créer des comptes administrateurs  

router.post('/signup', async function (req, res) {
    const { firstname, lastname, email, password } = req.body;
    if (password.length < 8) {
        return res.status(400).json({ error: 'Le mot de passe doit avoir 8 caractères' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ firstname, lastname, email, password: hashedPassword });
    const token = generateToken2(admin.id);
    res.json({ message: 'Compte créé avec succès', token });
});


// Permettre aux administrateurs existant de se connecter

router.post('/login', async function (req, res) {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
        where: {
            email: email
        }
    });
    if (!admin) {
        return res.status(400).json({ error: 'Identifiants incorrects' });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: 'Identifiants incorrects' });
    }
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: admin.id }, secret);
    res.json({ message: 'Vous êtes connecté', token });
});


// Route pour tester si le token JWT fonctionne

router.get('/test-token', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        const admin = await Admin.findOne({ where: { id: decoded.id } });
        if (!admin) {
            res.status(400).send('Erreur dans le mail ou le mot de passe');
            return;
        }
        res.json({
            id: decoded.id,
            displayName: admin.display_name
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('Erreur dans le token');
    }
});

module.exports = router;