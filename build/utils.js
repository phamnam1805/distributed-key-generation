"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const crypto_1 = require("crypto");
const util_1 = __importDefault(require("util"));
var Utils;
(function (Utils) {
    function getBigInt(n) {
        return BigInt(n.toString());
    }
    Utils.getBigInt = getBigInt;
    function getBigIntArray(arr) {
        let result = new Array();
        for (let i = 0; i < arr.length; i++) {
            result.push(getBigInt(arr[i]));
        }
        return result;
    }
    Utils.getBigIntArray = getBigIntArray;
    function getBigInteger(n) {
        return (0, big_integer_1.default)(n.toString(), 10);
    }
    Utils.getBigInteger = getBigInteger;
    function getBigIntegerArray(arr) {
        let result = new Array();
        for (let i = 0; i < arr.length; i++) {
            result.push(getBigInteger(arr[i]));
        }
        return result;
    }
    Utils.getBigIntegerArray = getBigIntegerArray;
    function getRandomBytes(n) {
        const buf = (0, crypto_1.randomBytes)(n);
        return (0, big_integer_1.default)(buf.toString("hex"), 16);
    }
    Utils.getRandomBytes = getRandomBytes;
    function bigIntegerToBuffer(msg, n) {
        let hex = msg.toString(16);
        while (hex.length < n * 2) {
            hex = "0" + hex;
        }
        let tmp = "";
        for (let i = 0; i < n; i++) {
            let start = 2 * n - 2 * (i + 1);
            tmp += hex.slice(start, start + 2);
        }
        return Buffer.from(tmp, "hex");
    }
    Utils.bigIntegerToBuffer = bigIntegerToBuffer;
    function bufferToBigInteger(buf, n) {
        let hex = bufferToHex(buf);
        while (hex.length < n * 2) {
            hex = "0" + hex;
        }
        let tmp = "";
        for (let i = 0; i < n; i++) {
            let start = 2 * n - 2 * (i + 1);
            tmp += hex.slice(start, start + 2);
        }
        return (0, big_integer_1.default)(tmp, 16);
    }
    Utils.bufferToBigInteger = bufferToBigInteger;
    function hexToBuffer(hex) {
        return Buffer.from(hex, "hex");
    }
    Utils.hexToBuffer = hexToBuffer;
    function bufferToHex(buf) {
        return buf.toString("hex");
    }
    Utils.bufferToHex = bufferToHex;
    function stringifyCircuitInput(circuitInput) {
        BigInt.prototype.toJSON = function () {
            return this.toString();
        };
        return JSON.stringify(circuitInput, null, " ");
    }
    Utils.stringifyCircuitInput = stringifyCircuitInput;
    function bigIntegerToHex32(number) {
        let str = number.toString(16);
        while (str.length < 64)
            str = "0" + str;
        return str;
    }
    Utils.bigIntegerToHex32 = bigIntegerToHex32;
    function genSolidityProof(pi_a, pi_b, pi_c) {
        const flatProof = [
            (0, big_integer_1.default)(pi_a[0]),
            (0, big_integer_1.default)(pi_a[1]),
            (0, big_integer_1.default)(pi_b[0][1]),
            (0, big_integer_1.default)(pi_b[0][0]),
            (0, big_integer_1.default)(pi_b[1][1]),
            (0, big_integer_1.default)(pi_b[1][0]),
            (0, big_integer_1.default)(pi_c[0]),
            (0, big_integer_1.default)(pi_c[1]),
        ];
        const proof = "0x" + flatProof.map((x) => bigIntegerToHex32(x)).join("");
        return proof;
    }
    Utils.genSolidityProof = genSolidityProof;
    function logFullObject(object) {
        console.log(util_1.default.inspect(object, {
            showHidden: false,
            depth: null,
            colors: true,
        }));
    }
    Utils.logFullObject = logFullObject;
})(Utils || (exports.Utils = Utils = {}));
