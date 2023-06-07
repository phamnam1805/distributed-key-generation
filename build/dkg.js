"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voter = exports.Committee = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const babyjub_1 = __importDefault(require("./babyjub"));
const utils_1 = require("./utils");
const pedersen_hash_1 = __importDefault(require("./pedersen-hash"));
var Committee;
(function (Committee) {
    function calculatePolynomialValue(a, t, x) {
        let result = (0, big_integer_1.default)(0);
        for (let i = 0; i < t; i++) {
            result = result.plus(a[i].multiply((0, big_integer_1.default)(x).pow(i)));
        }
        return result.mod(babyjub_1.default.subOrder);
    }
    function getRandomPolynomial(participantIndex, t, n) {
        let result = {
            C: new Array(),
            a0: 0n,
            f: {},
            secret: { i: 0, "f(i)": 0n },
        };
        let a = new Array(t);
        for (let i = 0; i < t; i++) {
            a[i] = utils_1.Utils.getRandomBytes(32).mod(babyjub_1.default.subOrder);
            let Ci = babyjub_1.default.mulPointBaseScalar(a[i]);
            result.C.push(utils_1.Utils.getBigIntArray(Ci));
        }
        result.a0 = utils_1.Utils.getBigInt(a[0]);
        let f = new Array(n);
        for (let i = 0; i < n; i++) {
            let x = i + 1;
            f[i] = calculatePolynomialValue(a, t, x);
            if (x != participantIndex) {
                result.f[x] = utils_1.Utils.getBigInt(f[i]);
            }
            else {
                result.secret = {
                    i: x,
                    "f(i)": utils_1.Utils.getBigInt(f[i]),
                };
            }
        }
        return result;
    }
    Committee.getRandomPolynomial = getRandomPolynomial;
    function getRound2Contribution(receiverIndex, receiverPublicKey, C, f) {
        let encryption = elgamalEncrypt(receiverPublicKey, f);
        let ciphers = [];
        ciphers.push(encryption.share.u[0]);
        ciphers.push(encryption.share.u[1]);
        ciphers.push(encryption.share.c);
        return {
            ciphers: ciphers,
            circuitInput: {
                recipientIndex: receiverIndex,
                recipientPublicKey: receiverPublicKey,
                C: C,
                u: encryption.circuitInput.u,
                c: encryption.circuitInput.c,
                f: f,
                b: encryption.circuitInput.b,
            },
        };
    }
    Committee.getRound2Contribution = getRound2Contribution;
    function getRound2Contributions(recipientIndexes, recipientPublicKeys, f, C) {
        let ciphers = [];
        let u = [];
        let c = [];
        let b = [];
        for (let i = 0; i < recipientPublicKeys.length; i++) {
            let encryption = elgamalEncrypt(recipientPublicKeys[i], f[i]);
            ciphers.push([
                encryption.share.u[0],
                encryption.share.u[1],
                encryption.share.c,
            ]);
            u.push(encryption.circuitInput.u);
            c.push(encryption.circuitInput.c);
            b.push(encryption.circuitInput.b);
        }
        return {
            ciphers: ciphers,
            circuitInput: {
                recipientIndexes: recipientIndexes,
                recipientPublicKeys: recipientPublicKeys,
                u: u,
                c: c,
                C: C,
                f: f,
                b: b,
            },
        };
    }
    Committee.getRound2Contributions = getRound2Contributions;
    function elgamalEncrypt(publicKey, msg) {
        let b = utils_1.Utils.getRandomBytes(32).mod(babyjub_1.default.subOrder);
        let u = babyjub_1.default.mulPointBaseScalar(b);
        let v = babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(publicKey), b);
        let k = pedersen_hash_1.default.hash(Buffer.concat([
            utils_1.Utils.bigIntegerToBuffer(u[0], 32),
            utils_1.Utils.bigIntegerToBuffer(u[1], 32),
            utils_1.Utils.bigIntegerToBuffer(v[0], 32),
            utils_1.Utils.bigIntegerToBuffer(v[1], 32),
        ]));
        let c = k.xor(utils_1.Utils.getBigInteger(msg));
        while (c.geq(babyjub_1.default.primeR)) {
            b = utils_1.Utils.getRandomBytes(32).mod(babyjub_1.default.subOrder);
            u = babyjub_1.default.mulPointBaseScalar(b);
            v = babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(publicKey), b);
            k = pedersen_hash_1.default.hash(Buffer.concat([
                utils_1.Utils.bigIntegerToBuffer(u[0], 32),
                utils_1.Utils.bigIntegerToBuffer(u[1], 32),
                utils_1.Utils.bigIntegerToBuffer(v[0], 32),
                utils_1.Utils.bigIntegerToBuffer(v[1], 32),
            ]));
            c = k.xor(utils_1.Utils.getBigInteger(msg));
        }
        return {
            share: {
                u: utils_1.Utils.getBigIntArray(u),
                c: utils_1.Utils.getBigInt(c),
            },
            circuitInput: {
                publicKey: publicKey,
                u: utils_1.Utils.getBigIntArray(u),
                c: utils_1.Utils.getBigInt(c),
                m: msg,
                b: utils_1.Utils.getBigInt(b),
            },
        };
    }
    Committee.elgamalEncrypt = elgamalEncrypt;
    function elgamalDecrypt(privateKey, u, c) {
        let pointU = utils_1.Utils.getBigIntegerArray(u);
        let v = babyjub_1.default.mulPointEscalar(pointU, utils_1.Utils.getBigInteger(privateKey));
        let k = pedersen_hash_1.default.hash(Buffer.concat([
            utils_1.Utils.bigIntegerToBuffer(pointU[0], 32),
            utils_1.Utils.bigIntegerToBuffer(pointU[1], 32),
            utils_1.Utils.bigIntegerToBuffer(v[0], 32),
            utils_1.Utils.bigIntegerToBuffer(v[1], 32),
        ]));
        let m = k.xor(utils_1.Utils.getBigInteger(c));
        return {
            m: utils_1.Utils.getBigInt(m),
            circuitInput: {
                u: u,
                c: c,
                m: utils_1.Utils.getBigInt(m),
                privateKey: privateKey,
            },
        };
    }
    Committee.elgamalDecrypt = elgamalDecrypt;
    function getPartialSecret(f) {
        let result = (0, big_integer_1.default)(0);
        for (let i = 0; i < f.length; i++) {
            result = result.plus(utils_1.Utils.getBigInteger(f[i]));
        }
        return utils_1.Utils.getBigInt(result.mod(babyjub_1.default.subOrder));
    }
    Committee.getPartialSecret = getPartialSecret;
    function getPublicKey(C) {
        let result = babyjub_1.default.getZeroPoint();
        for (let i = 0; i < C.length; i++) {
            result = babyjub_1.default.addPoint(result, utils_1.Utils.getBigIntegerArray(C[i]));
        }
        return utils_1.Utils.getBigIntArray(result);
    }
    Committee.getPublicKey = getPublicKey;
    function accumulateVote(R, M, votingDimension, userNumber) {
        let sumR = new Array(votingDimension);
        let sumM = new Array(votingDimension);
        for (let i = 0; i < votingDimension; i++) {
            sumR[i] = babyjub_1.default.getZeroPoint();
            sumM[i] = babyjub_1.default.getZeroPoint();
        }
        for (let i = 0; i < userNumber; i++) {
            for (let j = 0; j < votingDimension; j++) {
                sumR[j] = babyjub_1.default.addPoint(sumR[j], utils_1.Utils.getBigIntegerArray(R[i][j]));
                sumM[j] = babyjub_1.default.addPoint(sumM[j], utils_1.Utils.getBigIntegerArray(M[i][j]));
            }
        }
        let result = {
            R: new Array(votingDimension),
            M: new Array(votingDimension),
        };
        for (let i = 0; i < votingDimension; i++) {
            result.R[i] = utils_1.Utils.getBigIntArray(sumR[i]);
            result.M[i] = utils_1.Utils.getBigIntArray(sumM[i]);
        }
        return result;
    }
    Committee.accumulateVote = accumulateVote;
    function accumulateFund(R, M, votingDimension, userNumber) {
        let sumR = new Array(votingDimension);
        let sumM = new Array(votingDimension);
        for (let i = 0; i < votingDimension; i++) {
            sumR[i] = babyjub_1.default.getZeroPoint();
            sumM[i] = babyjub_1.default.getZeroPoint();
        }
        for (let i = 0; i < userNumber; i++) {
            for (let j = 0; j < votingDimension; j++) {
                sumR[j] = babyjub_1.default.addPoint(sumR[j], utils_1.Utils.getBigIntegerArray(R[i][j]));
                sumM[j] = babyjub_1.default.addPoint(sumM[j], utils_1.Utils.getBigIntegerArray(M[i][j]));
            }
        }
        let result = {
            R: new Array(votingDimension),
            M: new Array(votingDimension),
        };
        for (let i = 0; i < votingDimension; i++) {
            result.R[i] = utils_1.Utils.getBigIntArray(sumR[i]);
            result.M[i] = utils_1.Utils.getBigIntArray(sumM[i]);
        }
        return result;
    }
    Committee.accumulateFund = accumulateFund;
    function getTallyContribution(privateKey, f, u, c, R) {
        let decryptedF = new Array();
        for (let i = 0; i < u.length; i++) {
            let plain = elgamalDecrypt(privateKey, u[i], c[i]);
            decryptedF.push(plain.m);
        }
        let ski = getPartialSecret(decryptedF.concat(f));
        let D = new Array(R.length);
        for (let i = 0; i < R.length; i++) {
            let Di = babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(R[i]), utils_1.Utils.getBigInteger(ski));
            D[i] = utils_1.Utils.getBigIntArray(Di);
        }
        let result = {
            D: D,
            circuitInput: {
                u: u,
                c: c,
                decryptedF: decryptedF,
                f: f,
                R: R,
                D: D,
                privateKey: privateKey,
                partialSecret: ski,
            },
        };
        return result;
    }
    Committee.getTallyContribution = getTallyContribution;
    function getLagrangeCoefficient(listIndex) {
        let threshold = listIndex.length;
        let lagrangeCoefficient = new Array(threshold);
        for (let i = 0; i < threshold; i++) {
            let indexI = listIndex[i];
            let numerator = (0, big_integer_1.default)(1);
            let denominator = (0, big_integer_1.default)(1);
            for (let j = 0; j < threshold; j++) {
                let indexJ = listIndex[j];
                if (indexI != indexJ) {
                    numerator = numerator.multiply(indexJ);
                    denominator = denominator.multiply(indexJ - indexI);
                }
            }
            while (denominator.compareTo(0) < 0) {
                denominator = denominator.plus(babyjub_1.default.subOrder);
            }
            denominator = denominator.modInv(babyjub_1.default.subOrder);
            lagrangeCoefficient[i] = numerator
                .multiply(denominator)
                .mod(babyjub_1.default.subOrder);
        }
        return lagrangeCoefficient;
    }
    Committee.getLagrangeCoefficient = getLagrangeCoefficient;
    function getResultVector(listIndex, D, M) {
        let lagrangeCoefficient = getLagrangeCoefficient(listIndex);
        let threshold = listIndex.length;
        // for (let i = 1; i <= threshold; i++) {
        //     let indexI = i - 1;
        //     let numerator = bigInt(1);
        //     let denominator = bigInt(1);
        //     for (let j = 1; j <= threshold; j++) {
        //         if (j != i) {
        //             numerator = numerator.multiply(j);
        //             denominator = denominator.multiply(j - i);
        //         }
        //     }
        //     denominator = denominator.modInv(BabyJub.subOrder);
        //     lagrangeCoefficient[indexI] = numerator.multiply(denominator);
        //     while (lagrangeCoefficient[indexI].compareTo(0) < 0) {
        //         lagrangeCoefficient[indexI] = lagrangeCoefficient[indexI].plus(
        //             BabyJub.subOrder
        //         );
        //     }
        // }
        // console.log(lagrangeCoefficient);
        let sumD = Array(M.length);
        for (let i = 0; i < sumD.length; i++) {
            sumD[i] = babyjub_1.default.getZeroPoint();
        }
        for (let i = 0; i < threshold; i++) {
            for (let j = 0; j < sumD.length; j++) {
                sumD[j] = babyjub_1.default.addPoint(sumD[j], babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(D[i][j]), lagrangeCoefficient[i]));
            }
        }
        // console.log(sumD);
        for (let i = 0; i < sumD.length; i++) {
            // sumD[i] = BabyJub.mulPointEscalar(
            //     sumD[i],
            //     BabyJub.subOrder.minus(1)
            // );
            sumD[i][0] = babyjub_1.default.primeR.minus(sumD[i][0]);
        }
        let result = Array(M.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = utils_1.Utils.getBigIntArray(babyjub_1.default.addPoint(utils_1.Utils.getBigIntegerArray(M[i]), sumD[i]));
        }
        return result;
    }
    Committee.getResultVector = getResultVector;
})(Committee || (exports.Committee = Committee = {}));
var Voter;
(function (Voter) {
    function getVote(publicKey, idDAO, idProposal, votingVector, votingPower, nullifier, pathElements, pathIndices, pathRoot) {
        let dim = votingVector.length;
        let randomVector = new Array(dim);
        let R = new Array(dim);
        let M = new Array(dim);
        let result = {
            publicKey: publicKey,
            vi: votingPower,
            ri: new Array(),
            Ri: new Array(),
            Mi: new Array(),
            circuitInput: {
                publicKey: publicKey,
                idDAO: idDAO,
                idProposal: idProposal,
                nullifier: nullifier,
                pathElements: pathElements,
                pathIndices: pathIndices,
                pathRoot: pathRoot,
                nullifierHash: utils_1.Utils.getBigInt(pedersen_hash_1.default.hash(Buffer.concat([
                    utils_1.Utils.bigIntegerToBuffer(utils_1.Utils.getBigInteger(nullifier), 32),
                    utils_1.Utils.bigIntegerToBuffer(utils_1.Utils.getBigInteger(idProposal), 32),
                ]))),
                R: new Array(),
                M: new Array(),
                r: new Array(),
                votingPower: votingPower,
                o: votingVector,
            },
        };
        for (let i = 0; i < dim; i++) {
            randomVector[i] = utils_1.Utils.getRandomBytes(32).mod(babyjub_1.default.subOrder);
            R[i] = babyjub_1.default.mulPointBaseScalar(randomVector[i]);
            if (votingVector[i] == 1) {
                M[i] = babyjub_1.default.addPoint(babyjub_1.default.mulPointBaseScalar(utils_1.Utils.getBigInteger(votingPower)), babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(publicKey), randomVector[i]));
            }
            else {
                M[i] = babyjub_1.default.addPoint(babyjub_1.default.mulPointBaseScalar((0, big_integer_1.default)(0)), babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(publicKey), randomVector[i]));
            }
            result.ri.push(utils_1.Utils.getBigInt(randomVector[i]));
            result.Ri.push(utils_1.Utils.getBigIntArray(R[i]));
            result.Mi.push(utils_1.Utils.getBigIntArray(M[i]));
        }
        result.circuitInput.R = result.Ri;
        result.circuitInput.M = result.Mi;
        result.circuitInput.r = result.ri;
        return result;
    }
    Voter.getVote = getVote;
    function getFund(publicKey, idDAO, votingPower, votingVector) {
        let dim = idDAO.length;
        let randomVector = new Array(dim);
        let R = new Array(dim);
        let M = new Array(dim);
        let result = {
            publicKey: publicKey,
            vi: votingPower,
            ri: new Array(),
            Ri: new Array(),
            Mi: new Array(),
            commitment: utils_1.Utils.getBigInt((0, big_integer_1.default)(0)),
            circuitInput: {
                publicKey: publicKey,
                idDAO: idDAO,
                votingPower: votingPower,
                commitment: utils_1.Utils.getBigInt((0, big_integer_1.default)(0)),
                R: new Array(),
                M: new Array(),
                nullifier: utils_1.Utils.getBigInt((0, big_integer_1.default)(0)),
                r: new Array(),
                o: votingVector,
            },
        };
        let id = (0, big_integer_1.default)(0);
        for (let i = 0; i < dim; i++) {
            id = id.plus(utils_1.Utils.getBigInteger(idDAO[i]).multiply(votingVector[i]));
            randomVector[i] = utils_1.Utils.getRandomBytes(32).mod(babyjub_1.default.subOrder);
            R[i] = babyjub_1.default.mulPointBaseScalar(randomVector[i]);
            if (votingVector[i] == 1) {
                M[i] = babyjub_1.default.addPoint(babyjub_1.default.mulPointBaseScalar(utils_1.Utils.getBigInteger(votingPower)), babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(publicKey), randomVector[i]));
            }
            else {
                M[i] = babyjub_1.default.addPoint(babyjub_1.default.mulPointBaseScalar((0, big_integer_1.default)(0)), babyjub_1.default.mulPointEscalar(utils_1.Utils.getBigIntegerArray(publicKey), randomVector[i]));
            }
            result.ri.push(utils_1.Utils.getBigInt(randomVector[i]));
            result.Ri.push(utils_1.Utils.getBigIntArray(R[i]));
            result.Mi.push(utils_1.Utils.getBigIntArray(M[i]));
        }
        let nullifier = utils_1.Utils.getRandomBytes(32).mod(babyjub_1.default.primeR);
        let commitment = pedersen_hash_1.default.hash(Buffer.concat([
            utils_1.Utils.bigIntegerToBuffer(nullifier, 32),
            utils_1.Utils.bigIntegerToBuffer(id, 32),
            utils_1.Utils.bigIntegerToBuffer(utils_1.Utils.getBigInteger(votingPower), 32),
        ])).mod(babyjub_1.default.primeR);
        result.commitment = utils_1.Utils.getBigInt(commitment);
        result.circuitInput.commitment = utils_1.Utils.getBigInt(commitment);
        result.circuitInput.R = result.Ri;
        result.circuitInput.M = result.Mi;
        result.circuitInput.nullifier = utils_1.Utils.getBigInt(nullifier);
        result.circuitInput.r = result.ri;
        return result;
    }
    Voter.getFund = getFund;
})(Voter || (exports.Voter = Voter = {}));
