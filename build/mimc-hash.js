"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const circomlibjs_1 = require("circomlibjs");
var MiMC;
(function (MiMC) {
    function hashLeftRight(left, right) {
        return circomlibjs_1.mimcsponge.multiHash([left, right]).toString();
    }
    MiMC.hashLeftRight = hashLeftRight;
})(MiMC || (MiMC = {}));
exports.default = MiMC;
