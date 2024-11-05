import Dexie, { type EntityTable } from 'dexie';
import type { GameSettings } from './gameSetting';

// Indexed db

Dexie.debug = false;

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

export const idb = new Dexie('pictureSlicer') as Dexie & {
	customImages: EntityTable<CustomImage, 'id'>;
} & {
	gameCompletes: EntityTable<GameComplete, 'id'>;
};

idb.version(1).stores({
	customImages: '++id, name'
});

idb.version(2).stores({
	gameCompletes:
		'++id, settings.image.kind, settings.image.id, settings.image.key, settings.tileCount'
});

// Local db

export type Difficulty = 'easy' | 'medium' | 'hard';

const DifficultyKey = 'difficulty_v1';

export const ldb = {
	getDifficulty(): Difficulty {
		switch (window.localStorage.getItem(DifficultyKey)) {
			case 'easy':
			default:
				return 'easy';
			case 'medium':
				return 'medium';
			case 'hard':
				return 'hard';
		}
	},
	setDifficulty(difficulty: Difficulty) {
		console.log(difficulty);
		window.localStorage.setItem(DifficultyKey, difficulty);
	}
};
