const express = require('express');
const server = express();
const path = require('path');
require('dotenv').config({ path: ".env"});

const PORT = process.env.PORT || 3000;
const miscRoutes = require('./routes/misc');

// Serve static files
server.use(express.static(path.join(__dirname, './public')));

// Configure routes
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views', 'index.html'));
});
// ** Instead, refer to the controller for the random route **
server.use('/', miscRoutes);

// Run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
