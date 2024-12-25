const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
const createLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log(
  'Введите текст для записи в файл. Для выхода нажмите Ctrl+C или введите "exit".',
);
createLine.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    createLine.close();
  } else {
    writeStream.write(input + '\n');
  }
});
createLine.on('close', () => {
  console.log('Процесс завершен.');
  writeStream.end();
});
