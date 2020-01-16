interface Matcher<R> {
	doesMatch(row: R): boolean;
}

interface Finder<K, R> {
	find(index: Map<K, R>): R | undefined;
}

interface Indexer<R, K> {
	index(row: R): K;
}

// R: Row type
// V: Value type
class Equals<R, V> implements Matcher<R>, Finder<V, R>, Indexer<R, V> {
	readonly getter: (row: R) => V
	readonly value: V;

	constructor(getter: (row: R) => V, value: V) {
		this.getter = getter;
		this.value = value;
	}

	doesMatch(row: R): boolean {
		return this.getter(row) === this.value;
	}

	find(index: Map<V, R>): R | undefined {
		return index.get(this.value);
	}

	index(row: R): V {
		return this.getter(row);
	}
}

type Country = {
	name: string,
	population: number
}

const countries: Country[] = [
	{name: "Australia", population: 24.6},
	{name: "Canada", population: 36.54}
]

const byCountryName = new Equals<Country, string>((row) => row.name, "Australia");

console.log(true, byCountryName.doesMatch(countries[0]));
console.log(false, byCountryName.doesMatch(countries[1]));

console.log("Australia", byCountryName.index(countries[0]));
console.log("Canada", byCountryName.index(countries[1]));

var index: Map<string, Country> = new Map();
index.set("Australia", countries[0]);

console.log(countries[0], byCountryName.find(index));

