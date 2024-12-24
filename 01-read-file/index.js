const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readText = fs.createReadStream(filePath, 'utf8');
readText.pipe(process.stdout);
