const path = require('path');
const fs = require('fs').promises;
const folder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copy (folder, copyfolder){
    fs.mkdir(copyFolder).then(async() => {
        const items = await fs.readdir(folder, { withFileTypes: true });
        items.forEach(async(item) => {
            const from = path.join(folder, item.name);
            const to = path.join(copyfolder, item.name);
            item.isDirectory() ? copy(from, to) : await fs.copyFile(from, to)
        })
    }).catch(async() => {await fs.rm(copyfolder, {recursive: true});
    copy(folder, copyFolder);
});
}

copy(folder, copyFolder);