export function t(strings: TemplateStringsArray, ...args: any[]): string {
	const result = [strings[0]];
	let i = 1;
	for (const arg of args) {
		result.push(`${arg}`);
		result.push(strings[i]);
		i++;
	}
	return result.join('');
}

export function pluralize(word: string, count: number): string {
	if (count > 1) {
		return `${word}s`;
	} else {
		return `${word}`;
	}
}
