// Configuration de express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Lecture du fichier .env
require('dotenv').config()

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

// Importation des routeurs
const indexRouter = require('./routes/index.js');
const productRouter = require('./routes/product.js');
const customerRouter = require('./routes/customer.js');
const adminRouter = require('./routes/admin.js');

const middleware = require('./middleware');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/product', productRouter)
app.use('/customer', customerRouter)
app.use('/admin', adminRouter)

module.exports = app;