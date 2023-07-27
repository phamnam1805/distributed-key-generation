// @ts-ignore
import { poseidon } from "circomlibjs";
// @ts-ignore
import * as genPoseidonContract from "circomlibjs/src/poseidon_gencontract";
import { Element } from "fixed-merkle-tree";

namespace Poseidon {
    export function hashLeftRight(left: Element, right: Element) {
        return poseidon([left, right]);
    }

    export function getPoseidonContract() {
        return {
            abi: genPoseidonContract.abi,
            code: genPoseidonContract.createCode(2),
        };
    }
}

export default Poseidon;
