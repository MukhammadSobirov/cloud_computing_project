const express = require('express')

const router = express.Router();

const LandingController = require('../controllers/landing_C');
//landing
router.get('/', LandingController.getLanding);

module.exports = router;