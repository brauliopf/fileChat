const express = require('express');
const server = express();
const path = require('path');
require('dotenv').config({ path: "/config/.env"});

const PORT = process.env.PORT || 3000;
const miscRoutes = require('./routes/misc');
const gcpRoutes = require('./routes/gcp');

// Serve static files
server.use(express.static(path.join(__dirname, './public')));

// ### ROUTES
// *** Option 1: Serve the index.html file directly *** 
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views', 'index.html'));
});
// *** Option 2: Use a separate route file, that might use a controller ***
server.use('/', miscRoutes);

// BigQuery Routes
server.use('/bigquery', gcpRoutes);

// Run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
