import fs from 'node:fs';

export const exportData = JSON.parse(fs.readFileSync('data/DinoExports/ASB/Shastasaurus_141880616-227200328.json', 'utf-8'));
