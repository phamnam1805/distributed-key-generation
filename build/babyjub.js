"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const circomlibjs_1 = require("circomlibjs");
const big_integer_1 = __importDefault(require("big-integer"));
const utils_1 = require("./utils");
var BabyJub;
(function (BabyJub) {
    BabyJub.primeR = (0, big_integer_1.default)(circomlibjs_1.babyJub.p, 10);
    BabyJub.order = (0, big_integer_1.default)(circomlibjs_1.babyJub.order, 10);
    BabyJub.subOrder = (0, big_integer_1.default)(circomlibjs_1.babyJub.subOrder, 10);
    function addPoint(a, b) {
        let result = circomlibjs_1.babyJub.addPoint(utils_1.Utils.getBigIntArray(a), utils_1.Utils.getBigIntArray(b));
        return utils_1.Utils.getBigIntegerArray(result);
    }
    BabyJub.addPoint = addPoint;
    function mulPointEscalar(e, scalar) {
        let result = circomlibjs_1.babyJub.mulPointEscalar(utils_1.Utils.getBigIntArray(e), scalar.toString(10));
        return utils_1.Utils.getBigIntegerArray(result);
    }
    BabyJub.mulPointEscalar = mulPointEscalar;
    function mulPointBaseScalar(scalar) {
        let result = circomlibjs_1.babyJub.mulPointEscalar(circomlibjs_1.babyJub.Base8, scalar.toString(10));
        return utils_1.Utils.getBigIntegerArray(result);
    }
    BabyJub.mulPointBaseScalar = mulPointBaseScalar;
    function isOnCurve(p) {
        return circomlibjs_1.babyJub.inCurve(utils_1.Utils.getBigIntArray(p));
    }
    BabyJub.isOnCurve = isOnCurve;
    function getZeroPoint() {
        return [(0, big_integer_1.default)(0), (0, big_integer_1.default)(1)];
    }
    BabyJub.getZeroPoint = getZeroPoint;
    function packPoint(point) {
        return circomlibjs_1.babyJub.packPoint(utils_1.Utils.getBigIntArray(point));
    }
    BabyJub.packPoint = packPoint;
    function unpackPoint(packedPoint) {
        return utils_1.Utils.getBigIntegerArray(circomlibjs_1.babyJub.unpackPoint(packedPoint));
    }
    BabyJub.unpackPoint = unpackPoint;
})(BabyJub || (BabyJub = {}));
exports.default = BabyJub;
