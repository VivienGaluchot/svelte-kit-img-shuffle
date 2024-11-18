import * as paths from '$app/paths';

export type Tab = 'official' | 'custom';

export function get(tab: Tab, base: URL) {
	const url = new URL(base);
	url.pathname = paths.base;
	url.search = '';
	switch (tab) {
		case 'official':
			break;
		case 'custom':
			url.searchParams.set('t', 'custom');
			break;
	}
	return url;
}
