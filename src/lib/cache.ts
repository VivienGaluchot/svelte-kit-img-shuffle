export interface CachedFn<F> {
	call: F;
	clear: () => void;
}

export function cachedFn<Args extends any[], R>(
	inner: (...args: Args) => R
): CachedFn<(...args: Args) => R> {
	const fnCache = new Map<string, R>();
	return {
		call: (...args: Args) => {
			const key = JSON.stringify(args);
			const value = fnCache.get(key);
			if (value) {
				return value;
			} else {
				const value: R = inner(...args);
				fnCache.set(key, value);
				return value;
			}
		},
		clear: () => {
			fnCache.clear();
		}
	};
}
