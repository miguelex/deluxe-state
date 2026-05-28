import * as fs from 'fs';

const filePath = 'components/home/SearchFiltersModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// replace all dark:xxxx classes
content = content.replace(/\s?dark:[a-zA-Z0-9\-\/\[\]]+/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Stripped dark classes');
