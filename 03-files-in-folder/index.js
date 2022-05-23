const fs = require('fs').promises;
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, { withFileTypes: true })
.then((files) => {
    files.forEach(async(file) => {
        if(file.isFile()){
            const pathToFile = path.join(folder, file.name);
            const stat = await fs.stat(pathToFile);
            const info = path.parse(pathToFile);
            const size = stat.size
            console.log(`${info.name} - ${info.ext.slice(1)} - ${(stat.size/1024).toFixed(2)}KB`)
        }
    })
})