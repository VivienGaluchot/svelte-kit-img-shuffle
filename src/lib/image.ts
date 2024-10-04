import type * as lm from '$lib/math';

import image1 from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
import image2 from '$lib/assets/photo-1689085383650-13d21072f5a6.avif';
import image3 from '$lib/assets/bruno-martins-GkZvxVsHYWw-unsplash.jpg';
import image4 from '$lib/assets/alex-gagareen-r8_ZJ3qzgKo-unsplash.jpg';
import image5 from '$lib/assets/slava-auchynnikau-hAkmZyuHuRE-unsplash.jpg';
import image6 from '$lib/assets/tara-mae-miller-SzI9z8snVjk-unsplash.jpg';
import image7 from '$lib/assets/valeria-kodra-2mj8Yu6Vftc-unsplash.jpg';

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
	{ name: 'Town', url: image2, size: { x: 1374, y: 1031 }, color: "#8d8c81" },
	{ name: 'Street', url: image3, size: {x: 1920, y: 2880 }, color: "#ddd8d5" },
	{ name: 'Car', url: image4, size: {x: 1920, y: 2872 }, color: "#47949e" },
	{ name: 'Air ballon', url: image5, size: {x: 1920, y: 2880 }, color: "#f29c63" },
	{ name: 'Tag', url: image6, size: {x: 1920, y: 1273 }, color: "#f66c87" },
	{ name: 'Cozy', url: image7, size: {x: 1920, y: 2896 }, color: "#703814" }
];
