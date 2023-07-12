export interface CachedFn<F> {
	call: F;
	clear: () => void;
}

export function cachedFn<Args extends any[], R>(
	inner: (...args: Args) => R
): CachedFn<(...args: Args) => R> {
	const fnCache = new Map<Args, R>();
	return {
		call: (...args: Args) => {
			const value = fnCache.get(args);
			if (value) {
				return value;
			} else {
				const value: R = inner(...args);
				fnCache.set(args, value);
				return value;
			}
		},
		clear: () => {
			fnCache.clear();
		}
	};
}
