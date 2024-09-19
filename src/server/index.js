require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, '../client/static')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/views', 'index.html'));
});

app.get('/random', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/views', 'random.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
