"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const circomlibjs_1 = require("circomlibjs");
var Poseidon;
(function (Poseidon) {
    function hashLeftRight(left, right) {
        // let nRoundsF = 8;
        // let nRoundsPArr = [
        //     56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68
        // ];
        // let nInputs = 2;
        // let t = nInputs + 1;
        // let nRoundsP = nRoundsPArr[t - 2];
        let hashFunction = circomlibjs_1.poseidon.createHash();
        return hashFunction([left, right]);
    }
    Poseidon.hashLeftRight = hashLeftRight;
})(Poseidon || (Poseidon = {}));
exports.default = Poseidon;
