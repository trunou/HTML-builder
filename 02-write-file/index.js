const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const filepath = path.join(__dirname, 'text.txt');
let writeableStream = fs.createWriteStream(filepath);

stdout.write('Введите, что-нибудь\n');
stdin.on('data', data => {
    if(data.toString().trim() === 'exit'){
        process.exit();
    };
    writeableStream.write(data)
});
process.on('exit', () => stdout.write('Сворачиваемся. Пока!'));
process.on('SIGINT', () => process.exit());