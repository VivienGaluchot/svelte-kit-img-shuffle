import type * as lm from '$lib/math';

export interface PuzzleImage {
	url: string;
	// in pixel
	size: lm.Vec2d;
}

export function splitInCell(size: lm.Vec2d, n: number): lm.Vec2d {
	const y = Math.sqrt((n * size.y) / size.x);
	return { x: Math.round(n / y), y: Math.round(y) };
}
