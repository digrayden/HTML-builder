const fs = require('fs');
const path = require('path');

const srcDirectory = path.join(__dirname, 'files');
const destDirectory = path.join(__dirname, 'files-copy');

fs.promises
  .readdir(destDirectory)
  .then((files) => {
    const deletePromises = files.map((file) => {
      const filePath = path.join(destDirectory, file);
      return fs.promises.unlink(filePath);
    });
    return Promise.all(deletePromises);
  })
  .then(() => fs.promises.mkdir(destDirectory, { recursive: true }))
  .then(() => fs.promises.readdir(srcDirectory, { withFileTypes: true }))
  .then((entries) => {
    const promises = entries.map((entry) => {
      const pathSrc = path.join(srcDirectory, entry.name);
      const pathDest = path.join(destDirectory, entry.name);

      if (entry.isDirectory()) {
        return fs.promises
          .mkdir(pathDest, { recursive: true })
          .then(() => fs.promises.readdir(pathSrc, { withFileTypes: true }))
          .then((subEntries) => {
            const promisesSub = subEntries.map((subEntry) => {
              const pathSrcSub = path.join(pathSrc, subEntry.name);
              const pathDestSub = path.join(pathDest, subEntry.name);

              if (subEntry.isDirectory()) {
                return fs.promises.mkdir(pathDestSub, { recursive: true });
              } else {
                return fs.promises.copyFile(pathSrcSub, pathDestSub);
              }
            });
            return Promise.all(promisesSub);
          });
      } else {
        return fs.promises.copyFile(pathSrc, pathDest);
      }
    });
    return Promise.all(promises);
  })
  .then(() => console.log('Копирование успешно завершено.'))
  .catch((err) => console.error('Ошибка копирования:', err));
