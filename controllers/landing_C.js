const mongoose = require('mongoose');

exports.getLanding = (req, res, next) => {
    res.render('landing', {
        pageTitle: 'e-Brain | Finance Manager',
        path: '/',
    });
};