import { Indexable } from "./indexable";

export class And<R, VL, VR> implements Indexable<[VL, VR], R> {
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
