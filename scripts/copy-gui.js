const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../dist/apps/gui');
const destination = path.join(__dirname, '../apps/api/src/assets');

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

console.log('GUI copied to API assets');