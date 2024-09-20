const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/random', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'random.html'));
});

// You can add other miscellaneous routes here

module.exports = router;