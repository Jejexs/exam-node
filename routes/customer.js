const express = require('express');
const router = express.Router();

const { Customer } = require('../models');

const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware');


router.use(middleware.customerMiddleware);

function generateToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET);
}

router.post('/signup', async function (req, res) {
    const { firstname, lastname, email, address, phone, password } = req.body;
    if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Le mot de passe doit avoir 8 caractères' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ firstname, lastname, email, address, phone, password: hashedPassword });
    const token = generateToken(customer.id);
    res.json({ message: 'Compte créé avec succès', customer, token });
});

router.post('/login', async function (req, res) {
    const { email, password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Veuillez entrer un mot de passe' });
    }
    const customer = await Customer.findOne({
        where: {
            email: email
        }
    });
    if (!customer) {
        return res.status(400).json({ error: 'Identifiants incorrects' });
    }
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign({ customerId: customer.id }, 'secret');
    res.json({ message: 'Vous êtes connecté', customer, token });
});

module.exports = router;