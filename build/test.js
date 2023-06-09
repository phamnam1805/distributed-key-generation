"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_tree_1 = require("./merkle-tree");
const poseidon_hash_1 = __importDefault(require("./poseidon-hash"));
console.log(poseidon_hash_1.default.hashLeftRight(1, 2));
let tree = merkle_tree_1.Tree.getPoseidonHashTree(32);
tree.insert("1117582952394327218264374806630104116016694857615943107127336590235748983513");
// console.log(tree.path(0));
