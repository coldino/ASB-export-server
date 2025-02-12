import fs from 'node:fs';

function loadExportFile(filename: string) {
	return JSON.parse(fs.readFileSync(`data/DinoExports/ASB/${filename}`, 'utf-8'));
}

function loadServerFile(filename: string) {
	const hash = filename.split('.')[0];
	return [hash, JSON.parse(fs.readFileSync(`data/DinoExports/ASB/Servers/${filename}`, 'utf-8'))];
}

export const exportTestData = loadExportFile('Shastasaurus_141880616-227200328.json');
export const [serverTestDataHash, serverTestData] = loadServerFile('-1384464334.json');
