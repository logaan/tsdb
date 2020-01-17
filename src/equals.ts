import { Indexable } from "./indexable";

export class Equals<R, V> implements Indexable<V, R> {
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
