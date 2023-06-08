import { MerkleTree } from "fixed-merkle-tree";
declare namespace Tree {
    function getPoseidonHashTree(levels: number): MerkleTree;
    function getMiMCHashTree(levels: number): MerkleTree;
    function getDefaultTree(): MerkleTree;
}
export { Tree };
