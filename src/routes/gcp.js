const express = require('express');
const router = express.Router();
const path = require('path');
const gcpController = require('../controllers/gcp');

// GCP Connect - END

// ROUTES
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'random2.html'));
});

router.get('/test', gcpController.test);

module.exports = router;