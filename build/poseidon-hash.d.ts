import { Element } from "fixed-merkle-tree";
declare namespace Poseidon {
    function hashLeftRight(left: Element, right: Element): any;
    function getPoseidonContract(): {
        abi: any;
        code: any;
    };
}
export default Poseidon;
