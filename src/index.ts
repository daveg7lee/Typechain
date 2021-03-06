import * as CryptoJS from "crypto-js";
import { create } from "domain";

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (block: Block): boolean =>
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}
const genesisBlock: Block = new Block(0, "2020202020202", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimeStamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStamp
  );
  addBlock(newBlock);
  return newBlock;
};

const getHashForBlock = (block: Block): String =>
  Block.calculateBlockHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.data
  );

const isBlockValid = (canditateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(canditateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== canditateBlock.index) {
    return false;
  } else if (previousBlock.hash !== canditateBlock.previousHash) {
    return false;
  } else if (getHashForBlock(canditateBlock) !== canditateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (canditateBlock: Block): void => {
  if (isBlockValid(canditateBlock, getLatestBlock())) {
    blockchain.push(canditateBlock);
  }
};

createNewBlock("Second Block");
createNewBlock("Third Block");
createNewBlock("Fourth Block");

console.log(blockchain);

export {};
