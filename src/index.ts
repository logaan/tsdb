interface Indexable<K, R> {
    doesMatch(row: R): boolean;
    key(): K;
    index(row: R): K;
}

// R: Row type
// V: Value type
class Equals<R, V> implements Indexable<V, R> {
    readonly getter: (row: R) => V
    readonly value: V;

    constructor(getter: (row: R) => V, value: V) {
        this.getter = getter;
        this.value = value;
    }

    doesMatch(row: R): boolean {
        return this.getter(row) === this.value;
    }


    index(row: R): V {
        return this.getter(row);
    }

    key(): V {
        return this.value;
    }
}

class And<R, VL, VR> implements Indexable<[VL, VR], R> {
    readonly left: Indexable<VL, R>
    readonly right: Indexable<VR, R>

    constructor(left: Indexable<VL, R>, right: Indexable<VR, R>) {
        this.left = left;
        this.right = right;
    }

    doesMatch(row: R): boolean {
        return this.left.doesMatch(row)
            && this.right.doesMatch(row);
    }

    index(row: R): [VL, VR] {
        return [this.left.index(row),
                this.right.index(row)];
    }

    key(): [VL, VR] {
        return [this.left.key(),
                this.right.key()];
    }
}

// -------------------- Test suite --------------------
// -------------------- Helpers --------------------

function isEqual<A>(a1: A, a2: A): boolean {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function test<A>(expected: A, actual: A) {
    console.log(isEqual(expected, actual));
}

// -------------------- Data --------------------

type Country = {
    name: string,
    population: number
}

const countries: Country[] = [
    {name: "Australia", population: 24.6},
    {name: "Canada", population: 36.54}
]

// -------------------- Equals --------------------
const byCountryName = new Equals<Country, string>((row) => row.name, "Australia");

console.log(true === byCountryName.doesMatch(countries[0]));
console.log(false === byCountryName.doesMatch(countries[1]));

console.log("Australia" === byCountryName.index(countries[0]));
console.log("Canada" === byCountryName.index(countries[1]));

console.log("Australia" === byCountryName.key());

// -------------------- And --------------------
const byCountryPopulation = new Equals<Country, number>((row) => row.population, 24.6);
const byCountryNameAndPopn = new And(byCountryName, byCountryPopulation);

test(true, byCountryNameAndPopn.doesMatch(countries[0]));
test(false, byCountryNameAndPopn.doesMatch(countries[1]));

test(["Australia", 24.6], byCountryNameAndPopn.index(countries[0]));
test(["Canada", 36.54], byCountryNameAndPopn.index(countries[1]));

test(['Australia', 24.6], byCountryNameAndPopn.key());
