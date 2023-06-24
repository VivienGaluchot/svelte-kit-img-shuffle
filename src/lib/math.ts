export interface Vec2d {
	x: number;
	y: number;
}

export function vec2dAdd(a: Vec2d, b: Vec2d): Vec2d {
	return { x: a.x + b.x, y: a.y + b.y };
}

export function vec2dSubstract(a: Vec2d, b: Vec2d): Vec2d {
	return { x: a.x - b.x, y: a.y - b.y };
}

export function vec2dEqual(a: Vec2d, b: Vec2d): boolean {
	return a.x == b.x && a.y == b.y;
}
