const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET all events
router.get('/', eventController.getEvents);

// POST new event
router.post('/', eventController.addEvent);

module.exports = router;
