const express = require('express');
const router = express.Router();
const merchController = require('../controllers/merchController');

// GET all merch
router.get('/', merchController.getMerch);

// POST new merch item
router.post('/', merchController.addMerch);

module.exports = router;
