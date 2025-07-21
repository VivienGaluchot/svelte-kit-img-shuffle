import Dexie, { type EntityTable } from 'dexie';
import * as gs from './gameSetting';

// Indexed db

Dexie.debug = false;

export interface CustomImage {
	id: number;
	name: string;
	blob: Blob;
}

export interface GameComplete {
	id: number;
	settings: gs.GameSettings;
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

export type Difficulty = 'easy' | 'medium' | 'hard' | 'super-hard';

const DifficultyKey = 'difficulty_v1';

const IsSuperHardUnlocked = 'is_super_hard_unlocked_v1';

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
			case 'super-hard':
				return 'super-hard';
		}
	},
	setDifficulty(difficulty: Difficulty) {
		window.localStorage.setItem(DifficultyKey, difficulty);
	},

	getSuperHardUnlocked(): boolean {
		switch (window.localStorage.getItem(IsSuperHardUnlocked)) {
			case 'true':
				return true;
			case 'false':
			default:
				return false;
		}
	},
	setSuperHardUnlocked(isUnlocked: boolean) {
		if (isUnlocked) {
			window.localStorage.setItem(IsSuperHardUnlocked, 'true');
		} else {
			window.localStorage.setItem(IsSuperHardUnlocked, 'false');
		}
	}
};
