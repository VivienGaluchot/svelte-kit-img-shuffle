import type * as lm from '$lib/math';

import image1 from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
import image2 from '$lib/assets/photo-1689085383650-13d21072f5a6.avif';
import image3 from '$lib/assets/bruno-martins-GkZvxVsHYWw-unsplash.jpg';
import image4 from '$lib/assets/alex-gagareen-r8_ZJ3qzgKo-unsplash.jpg';
import image5 from '$lib/assets/slava-auchynnikau-hAkmZyuHuRE-unsplash.jpg';
import image6 from '$lib/assets/tara-mae-miller-SzI9z8snVjk-unsplash.jpg';
import image7 from '$lib/assets/valeria-kodra-2mj8Yu6Vftc-unsplash.jpg';

export type ImageResource = {
	// image name
	name: string;
	// image url
	url: string;
};

export interface PuzzleImage extends ImageResource {
	// image size in pixels
	size: lm.Vec2d;
}

export async function toPuzzleImage(res: ImageResource): Promise<PuzzleImage> {
	const meta: HTMLImageElement = await new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
		img.src = res.url;
	});
	return {
		...res,
		size: { x: meta.naturalWidth, y: meta.naturalHeight }
	};
}

export const staticImages: Record<string, ImageResource> = {
	sea: { name: 'Sea', url: image1 },
	town: { name: 'Town', url: image2 },
	street: { name: 'Street', url: image3 },
	car: { name: 'Car', url: image4 },
	air_ballon: { name: 'Air ballon', url: image5 },
	tag: { name: 'Tag', url: image6 },
	cosy: { name: 'Cozy', url: image7 }
};

export function splitInCell(size: lm.Vec2d, n: number): lm.Vec2d {
	const y = Math.sqrt((n * size.y) / size.x);
	return { x: Math.round(n / y), y: Math.round(y) };
}
