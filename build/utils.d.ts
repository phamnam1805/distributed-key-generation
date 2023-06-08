/// <reference types="node" />
import bigInt, { BigInteger } from "big-integer";
declare namespace Utils {
    function getBigInt(n: BigInteger): BigInt;
    function getBigIntArray(arr: Array<BigInteger>): Array<BigInt>;
    function getBigInteger(n: BigInt): bigInt.BigInteger;
    function getBigIntegerArray(arr: Array<BigInt>): Array<BigInteger>;
    function getRandomBytes(n: number): BigInteger;
    function bigIntegerToBuffer(msg: BigInteger, n: number): Buffer;
    function bufferToBigInteger(buf: Buffer, n: number): BigInteger;
    function hexToBuffer(hex: string): Buffer;
    function bufferToHex(buf: Buffer): string;
    function stringifyCircuitInput(circuitInput: any): string;
    function bigIntegerToHex32(number: BigInteger): string;
    function genSolidityProof(pi_a: string[], pi_b: string[][], pi_c: string[]): string;
    function logFullObject(object: any): void;
}
export { Utils };
//# sourceMappingURL=utils.d.ts.map