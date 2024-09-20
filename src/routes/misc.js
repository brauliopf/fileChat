const express = require('express');
const router = express.Router();
const path = require('path');

// ### AUX
// pdf text extraction
const fs = require('fs');
const pdf = require('pdf-parse');
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  try {
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text:', error);
    return null;
  }
}

// ### ROUTES
router.get('/random', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'random.html'));
});

router.get('/loadfile', (req, res) => {
  const out = extractTextFromPDF('./src/public/assets/pgs2-5.pdf')
  .then(text => res.status(200).json(text))
  .catch(err => console.error(err));
});

module.exports = router;