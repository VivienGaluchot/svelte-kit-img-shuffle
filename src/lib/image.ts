import type * as lm from '$lib/math';

import image1 from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
import image2 from '$lib/assets/photo-1689085383650-13d21072f5a6.avif';

export interface PuzzleImage {
	name: string;
	url: string;
	color: string;
	// in pixel
	size: lm.Vec2d;
}

export function splitInCell(size: lm.Vec2d, n: number): lm.Vec2d {
	const y = Math.sqrt((n * size.y) / size.x);
	return { x: Math.round(n / y), y: Math.round(y) };
}

export const images: PuzzleImage[] = [
	{ name: 'Sea', url: image1, size: { x: 930, y: 1162 }, color: "#277d7d" },
	{ name: 'Town', url: image2, size: { x: 1374, y: 1031 }, color: "#8d8c81" }
];
