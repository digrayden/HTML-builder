const fs = require('fs');
const path = require('path');
const stylesDirectory = path.join(__dirname, 'styles');
const outputDirectory = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputDirectory, 'bundle.css');
const outputStyles = fs.createWriteStream(bundleFile);
fs.readdir(stylesDirectory, (err, files) => {
  if (err) {
    return console.error('Ошибка чтения:', err);
  }
  files.forEach((file) => {
    const pathFile = path.join(stylesDirectory, file);
    if (path.extname(file) === '.css') {
      const input = fs.createReadStream(pathFile, 'utf-8');
      input.pipe(outputStyles);
    }
  });
});
