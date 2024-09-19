require('dotenv').config();
// About combining runnables to build a pipeline - https://js.langchain.com/docs/how_to/sequence/
// const { RunnablePassthrough, RunnableSequence } = require('@langchain/core/runnables')
// const { retriever } = require('../util/retriever.js');
// const { combineDocuments } = require('../util/combineDocuments.js');
const path = require('path');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, '../client/static')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/views', 'index.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
