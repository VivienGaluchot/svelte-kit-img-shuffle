export interface Vec2d {
	x: number;
	y: number;
}

export function vec2dAdd(a: Vec2d, b: Vec2d): Vec2d {
	return vec2dZip(a, b, (a, b) => a + b);
}

export function vec2dSubtract(a: Vec2d, b: Vec2d): Vec2d {
	return vec2dZip(a, b, (a, b) => a - b);
}

export function vec2dMultiply(a: Vec2d, b: Vec2d): Vec2d {
	return vec2dZip(a, b, (a, b) => a * b);
}

export function vec2dBound(a: Vec2d, bounds: { min?: Vec2d; max?: Vec2d }): Vec2d {
	let res = a;
	if (bounds.min) {
		res = vec2dZip(res, bounds.min, Math.max);
	}
	if (bounds.max) {
		res = vec2dZip(res, bounds.max, Math.min);
	}
	return res;
}

export function vec2dDivide(a: Vec2d, b: Vec2d): Vec2d {
	return vec2dZip(a, b, (a, b) => a / b);
}

export function vec2dMod(a: Vec2d, b: Vec2d): Vec2d {
	return vec2dZip(a, b, (a, b) => a % b);
}

export function vec2dFloor(a: Vec2d): Vec2d {
	return vec2dMap(a, Math.floor);
}

export function vec2dRound(a: Vec2d): Vec2d {
	return vec2dMap(a, Math.round);
}

export function vec2dEqual(a: Vec2d, b: Vec2d): boolean {
	return a.x == b.x && a.y == b.y;
}

export function vec2dMap(a: Vec2d, op: (x: number) => number): Vec2d {
	return { x: op(a.x), y: op(a.y) };
}

export function vec2dZip(a: Vec2d, b: Vec2d, op: (a: number, b: number) => number): Vec2d {
	return { x: op(a.x, b.x), y: op(a.y, b.y) };
}
