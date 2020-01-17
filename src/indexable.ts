export interface Indexable<K, R> {
    doesMatch(row: R): boolean;
    key(): K;
    index(row: R): K;
}
