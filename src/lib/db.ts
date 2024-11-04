import Dexie, { type EntityTable } from 'dexie';
import type { GameSettings } from './gameSetting';
import { PUBLIC_VERSION } from '$env/static/public';

Dexie.debug = PUBLIC_VERSION == 'dev';

export interface CustomImage {
	id: number;
	name: string;
	blob: Blob;
}

export interface GameComplete {
	id: number;
	settings: GameSettings;
	actionCount: number;
	durationInSec: number;
}

export const db = new Dexie('pictureSlicer') as Dexie & {
	customImages: EntityTable<CustomImage, 'id'>;
} & {
	gameCompletes: EntityTable<GameComplete, 'id'>;
};

db.version(1).stores({
	customImages: '++id, name'
});

db.version(2).stores({
	gameCompletes:
		'++id, settings.image.kind, settings.image.id, settings.image.key, settings.tileCount'
});
