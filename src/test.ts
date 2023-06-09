import { Tree } from "./merkle-tree";
import Poseidon from "./poseidon-hash";

console.log(Poseidon.hashLeftRight(1, 2));

let tree = Tree.getPoseidonHashTree(32);

tree.insert("1117582952394327218264374806630104116016694857615943107127336590235748983513")
// console.log(tree.path(0));
