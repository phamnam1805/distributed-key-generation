/// <reference types="node" />
import { BigInteger } from "big-integer";
declare namespace Pedersen {
    function hash(msg: Buffer): BigInteger;
}
export default Pedersen;
