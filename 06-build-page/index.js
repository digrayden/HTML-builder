const fs = require('fs');
const path = require('path');
const pathProjectDist = path.join(__dirname, 'project-dist');
fs.mkdir(pathProjectDist, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка создания папки:', err);
  }
});
const pathTemplate = path.join(__dirname, 'template.html');
fs.readFile(pathTemplate, 'utf-8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения шаблона:', err);
  }
  let template = data;
  const pathComponents = path.join(__dirname, 'components');
  fs.readdir(pathComponents, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки компонентов:', err);
    }
    files.forEach((file) => {
      const componentName = path.basename(file, '.html');
      const pathComponent = path.join(pathComponents, file);
      fs.readFile(pathComponent, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Ошибка чтения компонента ${componentName}:`, err);
        }
        const tag = `{{${componentName}}}`;
        template = template.replace(new RegExp(tag, 'g'), data);
        const pathIndex = path.join(pathProjectDist, 'index.html');
        fs.writeFile(pathIndex, template, (err) => {
          if (err) {
            console.error('Ошибка записи index.html:', err);
          }
        });
      });
    });
  });
});
const stylesDirectory = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'style.css');
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
const srcAssets = path.join(__dirname, 'assets');
const destAssets = path.join(pathProjectDist, 'assets');
fs.promises
  .mkdir(destAssets, { recursive: true })
  .then(() => fs.promises.readdir(srcAssets, { withFileTypes: true }))
  .then((files) => {
    const promises = files.map((file) => {
      const pathSrc = path.join(srcAssets, file.name);
      const pathDest = path.join(destAssets, file.name);
      if (file.isDirectory()) {
        return fs.promises
          .mkdir(pathDest, { recursive: true })
          .then(() => fs.promises.readdir(pathSrc, { withFileTypes: true }))
          .then((innerFiles) => {
            const innerPromises = innerFiles.map((innerFile) => {
              const innerSrcPath = path.join(pathSrc, innerFile.name);
              const innerDestPath = path.join(pathDest, innerFile.name);
              return fs.promises.copyFile(innerSrcPath, innerDestPath);
            });
            return Promise.all(innerPromises);
          });
      } else {
        return fs.promises.copyFile(srcAssets, pathDest);
      }
    });
    return Promise.all(promises);
  })
  .then(() => console.log('Копирование успешно завершено.'))
  .catch((err) => console.error('Ошибка копирования:', err));
