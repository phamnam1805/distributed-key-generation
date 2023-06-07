"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const circomlibjs_1 = require("circomlibjs");
const babyjub_1 = __importDefault(require("./babyjub"));
var Pedersen;
(function (Pedersen) {
    function hash(msg) {
        let hash = circomlibjs_1.pedersenHash.hash(msg);
        return babyjub_1.default.unpackPoint(hash)[0];
    }
    Pedersen.hash = hash;
})(Pedersen || (Pedersen = {}));
exports.default = Pedersen;
