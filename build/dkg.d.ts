import { BigInteger } from "big-integer";
import { Element } from "fixed-merkle-tree";
declare namespace Committee {
    function getRandomPolynomial(participantIndex: number, t: number, n: number): {
        C: Array<BigInt[]>;
        a0: BigInt;
        f: any;
        secret: {
            i: number;
            "f(i)": BigInt;
        };
    };
    function getRound2Contribution(receiverIndex: number, receiverPublicKey: Array<BigInt>, C: Array<BigInt[]>, f: BigInt): {
        ciphers: BigInt[];
        circuitInput: {
            recipientIndex: number;
            recipientPublicKey: BigInt[];
            C: BigInt[][];
            u: BigInt[];
            c: BigInt;
            f: BigInt;
            b: BigInt;
        };
    };
    function getRound2Contributions(recipientIndexes: number[], recipientPublicKeys: Array<BigInt[]>, f: Array<BigInt>, C: Array<BigInt[]>): {
        ciphers: BigInt[][];
        circuitInput: {
            recipientIndexes: number[];
            recipientPublicKeys: BigInt[][];
            u: BigInt[][];
            c: BigInt[];
            C: BigInt[][];
            f: BigInt[];
            b: BigInt[];
        };
    };
    function elgamalEncrypt(publicKey: Array<BigInt>, msg: BigInt): {
        share: {
            u: BigInt[];
            c: BigInt;
        };
        circuitInput: {
            publicKey: BigInt[];
            u: BigInt[];
            c: BigInt;
            m: BigInt;
            b: BigInt;
        };
    };
    function elgamalDecrypt(privateKey: BigInt, u: Array<BigInt>, c: BigInt): {
        m: BigInt;
        circuitInput: {
            u: BigInt[];
            c: BigInt;
            m: BigInt;
            privateKey: BigInt;
        };
    };
    function getPartialSecret(f: Array<BigInt>): BigInt;
    function getPublicKey(C: Array<BigInt[]>): Array<BigInt>;
    function accumulateVote(R: Array<Array<BigInt[]>>, M: Array<Array<BigInt[]>>, votingDimension: number, userNumber: number): {
        R: BigInt[][];
        M: BigInt[][];
    };
    function accumulateFund(R: Array<Array<BigInt[]>>, M: Array<Array<BigInt[]>>, votingDimension: number, userNumber: number): {
        R: BigInt[][];
        M: BigInt[][];
    };
    function getTallyContribution(privateKey: BigInt, f: BigInt, u: Array<BigInt[]>, c: Array<BigInt>, R: Array<BigInt[]>): {
        D: BigInt[][];
        circuitInput: {
            u: BigInt[][];
            c: BigInt[];
            decryptedF: BigInt[];
            f: BigInt;
            R: BigInt[][];
            D: BigInt[][];
            privateKey: BigInt;
            partialSecret: BigInt;
        };
    };
    function getLagrangeCoefficient(listIndex: Array<number>): Array<BigInteger>;
    function getResultVector(listIndex: Array<number>, D: Array<Array<BigInt[]>>, M: Array<BigInt[]>): Array<BigInt[]>;
}
declare namespace Voter {
    function getVote(publicKey: Array<BigInt>, idDAO: BigInt, idProposal: BigInt, votingVector: Array<number>, votingPower: BigInt, nullifier: BigInt, pathElements: Element[], pathIndices: number[], pathRoot: Element): {
        publicKey: BigInt[];
        vi: BigInt;
        ri: BigInt[];
        Ri: BigInt[][];
        Mi: BigInt[][];
        circuitInput: {
            publicKey: BigInt[];
            idDAO: BigInt;
            idProposal: BigInt;
            nullifier: BigInt;
            pathElements: Element[];
            pathIndices: number[];
            pathRoot: Element;
            nullifierHash: BigInt;
            R: BigInt[][];
            M: BigInt[][];
            r: BigInt[];
            votingPower: BigInt;
            o: number[];
        };
    };
    function getFund(publicKey: Array<BigInt>, idDAO: Array<BigInt>, votingPower: BigInt, votingVector: Array<number>): {
        publicKey: BigInt[];
        vi: BigInt;
        ri: BigInt[];
        Ri: BigInt[][];
        Mi: BigInt[][];
        commitment: BigInt;
        circuitInput: {
            publicKey: BigInt[];
            idDAO: BigInt[];
            votingPower: BigInt;
            commitment: BigInt;
            R: BigInt[][];
            M: BigInt[][];
            nullifier: BigInt;
            r: BigInt[];
            o: number[];
        };
    };
}
export { Committee, Voter };
//# sourceMappingURL=dkg.d.ts.map