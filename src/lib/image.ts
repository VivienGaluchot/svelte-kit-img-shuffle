import type * as lm from '$lib/math';
import type { Picture } from 'vite-imagetools';

import image1 from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif?enhanced';
import image2 from '$lib/assets/photo-1689085383650-13d21072f5a6.avif?enhanced';
import image3 from '$lib/assets/bruno-martins-GkZvxVsHYWw-unsplash.jpg?enhanced';
import image4 from '$lib/assets/alex-gagareen-r8_ZJ3qzgKo-unsplash.jpg?enhanced';
import image5 from '$lib/assets/slava-auchynnikau-hAkmZyuHuRE-unsplash.jpg?enhanced';
import image6 from '$lib/assets/tara-mae-miller-SzI9z8snVjk-unsplash.jpg?enhanced';
import image7 from '$lib/assets/valeria-kodra-2mj8Yu6Vftc-unsplash.jpg?enhanced';

export interface PuzzleImage {
	name: string;
	picture: Picture;
	color: string;
	url: string;
	size: lm.Vec2d;
}

export function splitInCell(size: lm.Vec2d, n: number): lm.Vec2d {
	const y = Math.sqrt((n * size.y) / size.x);
	return { x: Math.round(n / y), y: Math.round(y) };
}

function toPuzzleImage(name: string, picture: Picture, color: string): PuzzleImage {
	return {
		name,
		picture,
		color,
		url: picture.img.src,
		size: { x: picture.img.w, y: picture.img.h }
	};
}

export const images: PuzzleImage[] = [
	toPuzzleImage('Sea', image1, '#277d7d'),
	toPuzzleImage('Town', image2, '#8d8c81'),
	toPuzzleImage('Street', image3, '#ddd8d5'),
	toPuzzleImage('Car', image4, '#47949e'),
	toPuzzleImage('Air ballon', image5, '#f29c63'),
	toPuzzleImage('Tag', image6, '#f66c87'),
	toPuzzleImage('Cozy', image7, '#703814')
];
