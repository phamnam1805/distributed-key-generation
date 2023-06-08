/// <reference types="node" />
import bigInt, { BigInteger } from "big-integer";
declare namespace BabyJub {
    const primeR: BigInteger;
    const order: BigInteger;
    const subOrder: BigInteger;
    function addPoint(a: Array<BigInteger>, b: Array<BigInteger>): Array<BigInteger>;
    function mulPointEscalar(e: Array<BigInteger>, scalar: BigInteger): bigInt.BigInteger[];
    function mulPointBaseScalar(scalar: BigInteger): Array<BigInteger>;
    function isOnCurve(p: Array<BigInteger>): boolean;
    function getZeroPoint(): Array<BigInteger>;
    function packPoint(point: Array<BigInteger>): Buffer;
    function unpackPoint(packedPoint: Buffer): bigInt.BigInteger[];
}
export default BabyJub;
