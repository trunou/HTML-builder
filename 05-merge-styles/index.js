const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeCss() {
    let source = await fs.promises.readdir(folder, { withFileTypes: true});
    const writeStr = fs.createWriteStream(bundleFile);
    for (let file of source){
        let filePath = path.join(folder, file.name);
        if(file.isFile() && path.extname(file.name) === '.css'){
            let bundle = [];
            const read = fs.createReadStream(filePath, 'utf-8');
            read.on('data', chunk => bundle.push(chunk));
            read.on('end', () => bundle.forEach(file => writeStr.write(`${file}\n`)));
        }
    }
}

mergeCss();