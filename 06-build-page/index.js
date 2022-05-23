const fs = require('fs');
const path = require('path');
const { mkdir, readdir, readFile, copyFile, unlink } = require('fs/promises');

mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
const writeHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
let indexHtml = '';
readdir(path.join(__dirname, 'components'), {withFileTypes: true})
.then(async (components) => {
    indexHtml = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
    for (let item of components) {
        const component = item.name.split('.')[0];
        const componentCode = await readFile(path.join(__dirname, 'components', item.name));
        indexHtml = indexHtml.replace(`{{${component}}}`, componentCode);
    }
}).then(() => {writeHtml.write(indexHtml);});

const writeCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, res) => {
  res.forEach((el) => {
    if (path.extname(el.name) === '.css') {
      const read = fs.createReadStream(path.join(__dirname, 'styles', el.name), 'utf-8');
      read.on('data', chunk => writeCss.write(chunk));
    }
  });
});

mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true});
function moveAssets(destination) {
  readdir(destination, {withFileTypes: true}).then(res => {
    res.forEach(el => {
      if (el.isDirectory()) {
        moveAssets(path.join(destination, el.name));
      } else {
        unlink(path.join(destination, el.name)); 
      } 
    });
  });
}
moveAssets(path.join(__dirname, 'project-dist', 'assets'));

function copyAssets(src, dest) {
  readdir(src, {withFileTypes: true}).then(res => {
    res.forEach(el => {
      if (el.isDirectory()) {
        mkdir(path.join(dest, el.name), {recursive: true});
        copyAssets(path.join(src, el.name), path.join(dest, el.name));
      } else {
        copyFile(path.join(src, el.name), path.join(dest, el.name)); 
      } 
    });
  });
}
copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));