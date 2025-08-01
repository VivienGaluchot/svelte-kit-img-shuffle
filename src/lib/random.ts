// Custom random generator

export type RandomGenerator = () => number;

export interface Seed128 {
	a: number;
	b: number;
	c: number;
	d: number;
}

// From https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// Side note: Only designed & tested for seed generation,
// may be suboptimal as a general 128-bit hash.
export function getSeed128(str: string): Seed128 {
	let h1 = 1779033703,
		h2 = 3144134277,
		h3 = 1013904242,
		h4 = 2773480762;
	for (let i = 0, k; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	(h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
	return { a: h1 >>> 0, b: h2 >>> 0, c: h3 >>> 0, d: h4 >>> 0 };
}

// From https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export function getSfc32(seed: Seed128): RandomGenerator {
	let { a, b, c, d } = seed;
	return function () {
		a |= 0;
		b |= 0;
		c |= 0;
		d |= 0;
		let t = (((a + b) | 0) + d) | 0;
		d = (d + 1) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		c = (c + t) | 0;
		return (t >>> 0) / 4294967296;
	};
}

// Random services

export function shuffle<T>(rand: RandomGenerator, array: T[]) {
	let currentIndex = array.length;
	let randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(rand() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex]!, array[currentIndex]!];
	}
}

export function getRandomString(rand: RandomGenerator, length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(rand() * charactersLength));
		counter += 1;
	}
	return result;
}

export function randomPick<T>(rand: RandomGenerator, values: T[]): T | undefined {
	const randomIndex = Math.floor(rand() * values.length);
	return values[randomIndex];
}
