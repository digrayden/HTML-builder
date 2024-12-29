const fs = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const pathFile = path.join(folderPath, file.name);
      fs.stat(pathFile).then((fileStats) => {
        const sizeFile = (fileStats.size / 1024).toFixed(3);
        const extFile = path.extname(file.name).slice(1);
        const nameFile = path.basename(file.name, path.extname(file.name));
        console.log(`${nameFile} - ${extFile} - ${sizeFile}kb`);
      });
    }
  });
});
