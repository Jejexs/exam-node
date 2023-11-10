const jwt = require('jsonwebtoken');

function sqlQuery(query, callback) {
    pool.getConnection((connError, connection) => {
        if (connError) {
            console.log(connError);
            throw new Error("Erreur de connexion : " + connError);
        }
        connection.query(query, (error, result) => {
            connection.release();
            if (error) {
                console.log(error);
                throw new Error("Erreur de requête : " + error);
            }
            callback(result);
        });
    });
}

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    const secret2 = process.env.JWT_SECRET2;

    jwt.verify(token, secret2, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Token invalide' });
        }

        const userId = decoded.id;

        sqlQuery(`SELECT display_name, id FROM user WHERE id = ${userId}`, (results) => {
            if (results.length === 0) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            req.user = results[0];
            next();
        });
    });
}

function customerMiddleware(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Token invalide' });
        }

        const userId = decoded.id;

        sqlQuery(`SELECT display_name, id FROM user WHERE id = ${userId}`, (results) => {
            if (results.length === 0) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            req.user = results[0];
            next();
        });
    });
} ç

module.exports = {
    adminMiddleware,
    customerMiddleware,
};
