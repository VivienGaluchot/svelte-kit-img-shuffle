import Dexie, { type EntityTable } from 'dexie';

export interface CustomImage {
	id: number;
	name: string;
	blob: Blob;
}

export const db = new Dexie('pictureSlicer') as Dexie & {
	customImages: EntityTable<
		CustomImage,
		// primary key "id" for the typings only
		'id'
	>;
};

db.version(1).stores({
	// primary key "id" (for the runtime!)
	customImages: '++id, name'
});
