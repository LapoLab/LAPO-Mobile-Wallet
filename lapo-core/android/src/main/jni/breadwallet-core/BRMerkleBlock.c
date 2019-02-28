//
//  BRMerkleBlock.c
//
//  Created by Aaron Voisine on 8/6/15.
//  Copyright (c) 2015 breadwallet LLC
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

#include "BRMerkleBlock.h"
#include "BRCrypto.h"
#include "BRAddress.h"
#include "BRSet.h"
#include "uint256.h"
#include <stdlib.h>
#include <inttypes.h>
#include <limits.h>
#include <string.h>
#include <assert.h>
#include <stdio.h>

#define INIT_PROOF_OF_WORK 0x1e0fffff
#define LAST_POW_BLOCK 1051200
#define TARGET_SPACING   (30) // block time is ~30s
#define TARGET_TIMESPAN   (60 * 60) // the targeted timespan between difficulty target adjustments

inline static int _ceil_log2(int x)
{
    int r = (x & (x - 1)) ? 1 : 0;
    
    while ((x >>= 1) != 0) r++;
    return r;
}

// from https://en.bitcoin.it/wiki/Protocol_specification#Merkle_Trees
// Merkle trees are binary trees of hashes. Merkle trees in bitcoin use a double SHA-256, the SHA-256 hash of the
// SHA-256 hash of something. If, when forming a row in the tree (other than the root of the tree), it would have an odd
// number of elements, the final double-hash is duplicated to ensure that the row has an even number of hashes. First
// form the bottom row of the tree with the ordered double-SHA-256 hashes of the byte streams of the transactions in the
// block. Then the row above it consists of half that number of hashes. Each entry is the double-SHA-256 of the 64-byte
// concatenation of the corresponding two hashes below it in the tree. This procedure repeats recursively until we reach
// a row consisting of just a single double-hash. This is the merkle root of the tree.
//
// from https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki#Partial_Merkle_branch_format
// The encoding works as follows: we traverse the tree in depth-first order, storing a bit for each traversed node,
// signifying whether the node is the parent of at least one matched leaf txid (or a matched txid itself). In case we
// are at the leaf level, or this bit is 0, its merkle node hash is stored, and its children are not explored further.
// Otherwise, no hash is stored, but we recurse into both (or the only) child branch. During decoding, the same
// depth-first traversal is performed, consuming bits and hashes as they were written during encoding.
//
// example tree with three transactions, where only tx2 is matched by the bloom filter:
//
//     merkleRoot
//      /     \
//    m1       m2
//   /  \     /  \
// tx1  tx2 tx3  tx3
//
// flag bits (little endian): 00001011 [merkleRoot = 1, m1 = 1, tx1 = 0, tx2 = 1, m2 = 0, byte padding = 000]
// hashes: [tx1, tx2, m2]
//
// NOTE: this merkle tree design has a security vulnerability (CVE-2012-2459), which can be defended against by
// considering the merkle root invalid if there are duplicate hashes in any rows with an even number of elements

// returns a newly allocated merkle block struct that must be freed by calling BRMerkleBlockFree()
BRMerkleBlock *BRMerkleBlockNew(void)
{
    BRMerkleBlock *block = calloc(1, sizeof(*block));

    assert(block != NULL);
    
    block->height = BLOCK_UNKNOWN_HEIGHT;
    return block;
}

// returns a deep copy of block and that must be freed by calling BRMerkleBlockFree()
BRMerkleBlock *BRMerkleBlockCopy(const BRMerkleBlock *block)
{
    BRMerkleBlock *cpy = BRMerkleBlockNew();

    assert(block != NULL);
    *cpy = *block;
    cpy->hashes = NULL;
    cpy->flags = NULL;
    BRMerkleBlockSetTxHashes(cpy, block->hashes, block->hashesCount, block->flags, block->flagsLen);
    return cpy;
}

// buf must contain either a serialized merkleblock or header
// returns a merkle block struct that must be freed by calling BRMerkleBlockFree()
BRMerkleBlock *BRMerkleBlockParse(const uint8_t *buf, size_t bufLen)
{
    BRMerkleBlock *block = (buf && HEADER_SIZE <= bufLen) ? BRMerkleBlockNew() : NULL;
    size_t off = 0, len = 0;
    
    assert(buf != NULL || bufLen == 0);
    
    if (block) {
        block->version = UInt32GetLE(&buf[off]);
        off += sizeof(uint32_t);
        block->prevBlock = UInt256Get(&buf[off]);
        off += sizeof(UInt256);
        block->merkleRoot = UInt256Get(&buf[off]);
        off += sizeof(UInt256);
        block->timestamp = UInt32GetLE(&buf[off]);
        off += sizeof(uint32_t);
        block->target = UInt32GetLE(&buf[off]);
        off += sizeof(uint32_t);
        block->nonce = UInt32GetLE(&buf[off]);
        off += sizeof(uint32_t);

        block->nAccumulatorCheckpoint = UInt256Get(&buf[off]);
        off += sizeof(UInt256);

        
        if (off + sizeof(uint32_t) <= bufLen) {
            block->totalTx = UInt32GetLE(&buf[off]);
            off += sizeof(uint32_t);
            block->hashesCount = (size_t)BRVarInt(&buf[off], (off <= bufLen ? bufLen - off : 0), &len);
            off += len;
            len = block->hashesCount*sizeof(UInt256);
            block->hashes = (off + len <= bufLen) ? malloc(len) : NULL;
            if (block->hashes) memcpy(block->hashes, &buf[off], len);
            off += len;
            block->flagsLen = (size_t)BRVarInt(&buf[off], (off <= bufLen ? bufLen - off : 0), &len);
            off += len;
            len = block->flagsLen;
            block->flags = (off + len <= bufLen) ? malloc(len) : NULL;
            if (block->flags) memcpy(block->flags, &buf[off], len);
        }

        HashLyra2z(&block->blockHash, buf, HEADER_SIZE);
    }
    
    return block;
}

// returns number of bytes written to buf, or total bufLen needed if buf is NULL (block->height is not serialized)
size_t BRMerkleBlockSerialize(const BRMerkleBlock *block, uint8_t *buf, size_t bufLen)
{
    size_t off = 0, len = HEADER_SIZE;
    
    assert(block != NULL);
    
    if (block->totalTx > 0) {
        len += sizeof(uint32_t) + BRVarIntSize(block->hashesCount) + block->hashesCount*sizeof(UInt256) +
               BRVarIntSize(block->flagsLen) + block->flagsLen;
    }
    
    if (buf && len <= bufLen) {
        UInt32SetLE(&buf[off], block->version);
        off += sizeof(uint32_t);
        UInt256Set(&buf[off], block->prevBlock);
        off += sizeof(UInt256);
        UInt256Set(&buf[off], block->merkleRoot);
        off += sizeof(UInt256);
        UInt32SetLE(&buf[off], block->timestamp);
        off += sizeof(uint32_t);
        UInt32SetLE(&buf[off], block->target);
        off += sizeof(uint32_t);
        UInt32SetLE(&buf[off], block->nonce);
        off += sizeof(uint32_t);
        UInt256Set(&buf[off], block->nAccumulatorCheckpoint);
        off += sizeof(UInt256);
    
        if (block->totalTx > 0) {
            UInt32SetLE(&buf[off], block->totalTx);
            off += sizeof(uint32_t);
            off += BRVarIntSet(&buf[off], (off <= bufLen ? bufLen - off : 0), block->hashesCount);
            if (block->hashes) memcpy(&buf[off], block->hashes, block->hashesCount*sizeof(UInt256));
            off += block->hashesCount*sizeof(UInt256);
            off += BRVarIntSet(&buf[off], (off <= bufLen ? bufLen - off : 0), block->flagsLen);
            if (block->flags) memcpy(&buf[off], block->flags, block->flagsLen);
            off += block->flagsLen;
        }
    }
    
    return (! buf || len <= bufLen) ? len : 0;
}

static size_t _BRMerkleBlockTxHashesR(const BRMerkleBlock *block, UInt256 *txHashes, size_t hashesCount, size_t *idx,
                                      size_t *hashIdx, size_t *flagIdx, int depth)
{
    uint8_t flag;
    
    if (*flagIdx/8 < block->flagsLen && *hashIdx < block->hashesCount) {
        flag = (block->flags[*flagIdx/8] & (1 << (*flagIdx % 8)));
        (*flagIdx)++;
    
        if (! flag || depth == _ceil_log2(block->totalTx)) {
            if (flag && *idx < hashesCount) {
                if (txHashes) txHashes[*idx] = block->hashes[*hashIdx]; // leaf
                (*idx)++;
            }
        
            (*hashIdx)++;
        }
        else {
            _BRMerkleBlockTxHashesR(block, txHashes, hashesCount, idx, hashIdx, flagIdx, depth + 1); // left branch
            _BRMerkleBlockTxHashesR(block, txHashes, hashesCount, idx, hashIdx, flagIdx, depth + 1); // right branch
        }
    }

    return *idx;
}

// populates txHashes with the matched tx hashes in the block
// returns number of hashes written, or the total hashesCount needed if txHashes is NULL
size_t BRMerkleBlockTxHashes(const BRMerkleBlock *block, UInt256 *txHashes, size_t hashesCount)
{
    size_t idx = 0, hashIdx = 0, flagIdx = 0;

    assert(block != NULL);
    
    return _BRMerkleBlockTxHashesR(block, txHashes, (txHashes) ? hashesCount : SIZE_MAX, &idx, &hashIdx, &flagIdx, 0);
}

// sets the hashes and flags fields for a block created with BRMerkleBlockNew()
void BRMerkleBlockSetTxHashes(BRMerkleBlock *block, const UInt256 hashes[], size_t hashesCount,
                              const uint8_t *flags, size_t flagsLen)
{
    assert(block != NULL);
    assert(hashes != NULL || hashesCount == 0);
    assert(flags != NULL || flagsLen == 0);
    
    if (block->hashes) free(block->hashes);
    block->hashes = (hashesCount > 0) ? malloc(hashesCount*sizeof(UInt256)) : NULL;
    if (block->hashes) memcpy(block->hashes, hashes, hashesCount*sizeof(UInt256));
    if (block->flags) free(block->flags);
    block->flags = (flagsLen > 0) ? malloc(flagsLen) : NULL;
    if (block->flags) memcpy(block->flags, flags, flagsLen);
}

// recursively walks the merkle tree to calculate the merkle root
// NOTE: this merkle tree design has a security vulnerability (CVE-2012-2459), which can be defended against by
// considering the merkle root invalid if there are duplicate hashes in any rows with an even number of elements
static UInt256 _BRMerkleBlockRootR(const BRMerkleBlock *block, size_t *hashIdx, size_t *flagIdx, int depth)
{
    uint8_t flag;
    UInt256 hashes[2], md = UINT256_ZERO;

    if (*flagIdx/8 < block->flagsLen && *hashIdx < block->hashesCount) {
        flag = (block->flags[*flagIdx/8] & (1 << (*flagIdx % 8)));
        (*flagIdx)++;

        if (flag && depth != _ceil_log2(block->totalTx)) {
            hashes[0] = _BRMerkleBlockRootR(block, hashIdx, flagIdx, depth + 1); // left branch
            hashes[1] = _BRMerkleBlockRootR(block, hashIdx, flagIdx, depth + 1); // right branch

            if (! UInt256IsZero(hashes[0]) && ! UInt256Eq(hashes[0], hashes[1])) {
                if (UInt256IsZero(hashes[1])) hashes[1] = hashes[0]; // if right branch is missing, dup left branch
                BRSHA256_2(&md, hashes, sizeof(hashes));
            }
            else *hashIdx = SIZE_MAX; // defend against (CVE-2012-2459)
        }
        else md = block->hashes[(*hashIdx)++]; // leaf
    }
    
    return md;
}

// true if merkle tree and timestamp are valid, and proof-of-work matches the stated difficulty target
// NOTE: this only checks if the block difficulty matches the difficulty target in the header, it does not check if the
// target is correct for the block's height in the chain - use BRMerkleBlockVerifyDifficulty() for that
int BRMerkleBlockIsValid(const BRMerkleBlock *block, uint32_t currentTime)
{
    assert(block != NULL);
    
    // target is in "compact" format, where the most significant byte is the size of the value in bytes, next
    // bit is the sign, and the last 23 bits is the value after having been right shifted by (size - 3)*8 bits
    const uint32_t size = block->target >> 24, target = block->target & 0x007fffff;
    size_t hashIdx = 0, flagIdx = 0;
    UInt256 merkleRoot = _BRMerkleBlockRootR(block, &hashIdx, &flagIdx, 0), t = UINT256_ZERO;
    int r = 1;
    
    // check if merkle root is correct
    if (block->totalTx > 0 && ! UInt256Eq(merkleRoot, block->merkleRoot)) r = 0;
    
    // check if timestamp is too far in future
    if (block->timestamp > currentTime + BLOCK_MAX_TIME_DRIFT) r = 0;
    
    // check if proof-of-work target is out of range
    if (target == 0 || (block->target & 0x00800000) || block->target > INIT_PROOF_OF_WORK) r = 0;
    
    if (size > 3) UInt32SetLE(&t.u8[size - 3], target);
    else UInt32SetLE(t.u8, target >> (3 - size)*8);
    
    /*for (int i = sizeof(t) - 1; r && i >= 0; i--) { // check proof-of-work
        if (block->blockHash.u8[i] < t.u8[i]) break;
        if (block->blockHash.u8[i] > t.u8[i]) r = 0;
    }*/
    
    return r;
}

// true if the given tx hash is known to be included in the block
int BRMerkleBlockContainsTxHash(const BRMerkleBlock *block, UInt256 txHash)
{
    int r = 0;
    
    assert(block != NULL);
    assert(! UInt256IsZero(txHash));
    
    for (size_t i = 0; ! r && i < block->hashesCount; i++) {
        if (UInt256Eq(block->hashes[i], txHash)) r = 1;
    }
    
    return r;
}

uint256_t Uint64ToArith256(uint64_t u64) {
    uint256_t res;
    clear256(&res);
    res.elements[1].elements[1] = u64;
    return res;
}

// This implementation directly uses shifts instead of going
// through an intermediate MPI representation.
uint256_t SetCompact(uint32_t nCompact)
{
    int nSize = nCompact >> 24;
    uint32_t nWord = nCompact & 0x007fffff;
    uint256_t res;
    clear256(&res);

    if (nSize <= 3) {
        nWord >>= 8 * (3 - nSize);
        res.elements[1].elements[1] = nWord;
    } else {
        res.elements[1].elements[1] = nWord;

        shiftl256(&res, (uint32_t) 8 * (nSize - 3), &res);
    }

    return res;
}

uint32_t GetCompact(uint256_t full)
{
    int nSize = (bits256(&full) + 7) / 8;
    uint32_t nCompact = 0;

    if (nSize <= 3) {
        nCompact = (uint32_t) full.elements[1].elements[1] << 8 * (3 - nSize);
    } else {
        uint256_t bn;
        shiftr256(&full, (uint32_t) 8 * (nSize - 3), &bn);
        nCompact = (uint32_t) bn.elements[1].elements[1];
    }
    // The 0x00800000 bit denotes the sign.
    // Thus, if it is already set, divide the mantissa by 256 and increase the exponent.
    if (nCompact & 0x00800000) {
        nCompact >>= 8;
        nSize++;
    }
    assert((nCompact & ~0x007fffff) == 0);
    assert(nSize < 256);
    nCompact |= nSize << 24;
    return nCompact;
}

// verifies the block difficulty target is correct for the block's position in the chain
// see pow.cpp in lapo daemon
// @return block difficulty
int BRMerkleBlockGetDifficulty(const BRMerkleBlock *block, const BRSet *blockSet)
{
    const BRMerkleBlock* pindexLast = ((const BRMerkleBlock*)BRSetGet(blockSet, &block->prevBlock));
    const BRMerkleBlock* BlockLastSolved = pindexLast;
    const BRMerkleBlock* BlockReading = pindexLast;
    int64_t nActualTimespan = 0;
    int64_t LastBlockTime = 0;
    int64_t PastBlocksMin = 24;
    int64_t PastBlocksMax = 24;
    int64_t CountBlocks = 0;
    uint256_t PastDifficultyAverage;
    uint256_t PastDifficultyAveragePrev;

    if (BlockLastSolved == NULL || BlockLastSolved->height == 0 || BlockLastSolved->height < PastBlocksMin) {
        return INIT_PROOF_OF_WORK;
    }

    UInt256 bnTargetLimit_uint256 = uint256("000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    uint256_t bnTargetLimit_arith;
    readu256BE(bnTargetLimit_uint256.u8, &bnTargetLimit_arith);

    if (pindexLast->height > LAST_POW_BLOCK) {
        int64_t nTargetSpacing = TARGET_SPACING;
        int64_t nTargetTimespan = TARGET_TIMESPAN;

        int64_t nActualSpacing = 0;
        if (pindexLast->height != 0)
            nActualSpacing = pindexLast->timestamp - ((const BRMerkleBlock*)BRSetGet(blockSet, &pindexLast->prevBlock))->timestamp;

        if (nActualSpacing < 0)
            nActualSpacing = 1;

        // ppcoin: target change every block
        // ppcoin: retarget with exponential moving toward target spacing
        uint256_t bnNew = SetCompact(pindexLast->target);

        int64_t nInterval = nTargetTimespan / nTargetSpacing;
        //bnNew *= ((nInterval - 1) * nTargetSpacing + nActualSpacing + nActualSpacing);
        //bnNew /= ((nInterval + 1) * nTargetSpacing);
        uint256_t tmp = Uint64ToArith256((uint64_t) ((nInterval - 1) * nTargetSpacing + nActualSpacing + nActualSpacing));
        mul256(&bnNew, &tmp, &bnNew);

        tmp = Uint64ToArith256((uint64_t)  ((nInterval + 1) * nTargetSpacing));
        divmod256(&bnNew, &tmp, &bnNew, &tmp);

        uint256_t zero;
        clear256(&zero);

        if (equal256(&bnNew, &zero) || gt256(&bnNew, &bnTargetLimit_arith))
            bnNew = bnTargetLimit_arith;

        return GetCompact(bnNew);
    }

    for (unsigned int i = 1; BlockReading && BlockReading->height > 0; i++) {
        if (PastBlocksMax > 0 && i > PastBlocksMax) {
            break;
        }
        CountBlocks++;

        if (CountBlocks <= PastBlocksMin) {
            if (CountBlocks == 1) {
                PastDifficultyAverage = SetCompact(BlockReading->target);
            } else {
                //PastDifficultyAverage = ((PastDifficultyAveragePrev * CountBlocks) + (UInt256().SetCompact(BlockReading->nBits))) / (CountBlocks + 1);
                PastDifficultyAverage = SetCompact(BlockReading->target);
                uint256_t tmp = Uint64ToArith256((uint64_t) CountBlocks);
                mul256(&PastDifficultyAveragePrev, &tmp, &tmp);
                add256(&tmp, &PastDifficultyAverage, &PastDifficultyAverage);
                tmp = Uint64ToArith256((uint64_t)  (CountBlocks + 1));
                divmod256(&PastDifficultyAverage, &tmp, &PastDifficultyAverage, &tmp);
            }
            PastDifficultyAveragePrev = PastDifficultyAverage;
        }

        if (LastBlockTime > 0) {
            int64_t Diff = (LastBlockTime - BlockReading->timestamp);
            nActualTimespan += Diff;
        }
        LastBlockTime = BlockReading->timestamp;

        if (BRSetGet(blockSet, &BlockReading->prevBlock) == NULL) {
            assert(BlockReading);
            break;
        }
        BlockReading = ((const BRMerkleBlock*)BRSetGet(blockSet, &BlockReading->prevBlock));
    }

    UInt256 bnProofOfWorkLimit_uint256 = uint256("00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    uint256_t bnProofOfWorkLimit_arith;
    readu256BE(bnProofOfWorkLimit_uint256.u8, &bnProofOfWorkLimit_arith);

    uint256_t bnNew = PastDifficultyAverage;

    int64_t _nTargetTimespan = CountBlocks * TARGET_SPACING;

    if (nActualTimespan < _nTargetTimespan / 3)
        nActualTimespan = _nTargetTimespan / 3;
    if (nActualTimespan > _nTargetTimespan * 3)
        nActualTimespan = _nTargetTimespan * 3;

    // Retarget
    //bnNew *= nActualTimespan;
    //bnNew /= _nTargetTimespan;
    uint256_t tmp = Uint64ToArith256((uint64_t) nActualTimespan);
    mul256(&bnNew, &tmp, &bnNew);
    tmp = Uint64ToArith256((uint64_t) _nTargetTimespan);
    divmod256(&bnNew, &tmp, &bnNew, &tmp);

    if (gt256(&bnNew, &bnProofOfWorkLimit_arith)) {
        bnNew = bnProofOfWorkLimit_arith;
    }

    return GetCompact(bnNew);
}

int checkProofOfWork(const BRMerkleBlock *block) {
    uint256_t target = SetCompact(block->target);
    uint256_t hash_arith;
    readu256BE((uint8_t*) block->blockHash.u8, &hash_arith);
    return gt256(&hash_arith, &target);
}

// frees memory allocated by BRMerkleBlockParse
void BRMerkleBlockFree(BRMerkleBlock *block)
{
    assert(block != NULL);
    
    if (block->hashes) free(block->hashes);
    if (block->flags) free(block->flags);
    free(block);
}
