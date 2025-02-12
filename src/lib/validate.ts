const requiredExportTextFields = ['DinoName', 'DinoID1', 'DinoID2', 'SpeciesName', 'BlueprintPath'];

const requiredExportArrayFields = [['Stats', 12]];

export function isValidExport(data: unknown): data is Record<string, unknown> {
	if (!data || typeof data !== 'object') return false;
	const dataObj = data as Record<string, unknown>;

	// Check all required text fields are present
	for (const field of requiredExportTextFields) {
		if (typeof dataObj[field] !== 'string') return false;
	}

	// Check Stats is an array of 12 items
	for (const [field, length] of requiredExportArrayFields) {
		const array = dataObj[field];
		if (!Array.isArray(array) || array.length !== length) return false;
	}

	return true;
}

const requiredServerNumberFields = [
	'MaxWildLevel',
	'TamingSpeedMultiplier',
	'MatingIntervalMultiplier',
	'BabyImprintingStatScaleMultiplier',
];

const requiredServerArrayFields = [
	['WildLevel', 12],
	['TameLevel', 12],
	['TameAdd', 12],
	['TameAff', 12],
];

export function isValidServer(data: unknown): data is Record<string, unknown> {
	if (!data || typeof data !== 'object') return false;
	const dataObj = data as Record<string, unknown>;

	// Check all required text fields are present
	for (const field of requiredServerNumberFields) {
		if (typeof dataObj[field] !== 'number') return false;
	}

	// Check Stats is an array of 12 items
	for (const [field, length] of requiredServerArrayFields) {
		const array = dataObj[field];
		if (!Array.isArray(array) || array.length !== length) return false;
	}

	return true;
}

const tokenRegex = /^[a-zA-Z0-9-]{6,}$/;

export function isTokenValid(value: string) {
	return value && typeof value === 'string' && tokenRegex.test(value);
}

const hashRe = /^-?[0-9]{1,10}$/;

export function isHashValid(value: string) {
	return value && typeof value === 'string' && hashRe.test(value);
}

const responseIdRe = /^[0-9a-z]{8,32}$/;

export function isResponseIdValid(value: string) {
	return value && typeof value === 'string' && responseIdRe.test(value);
}
