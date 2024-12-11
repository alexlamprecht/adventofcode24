import * as fs from "fs";

const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";

const diskmap = fs.readFileSync(inputFilename, "utf-8").trim();

const constructFileBlocks = (diskmap: string) => {
  const fileBlocks: { isEmpty: boolean; value: number }[] = [];

  diskmap.split("").forEach((char, i) => {
    const value = Number(char);
    if (i % 2 === 0) {
      for (let j = 0; j < value; j++) {
        fileBlocks.push({ isEmpty: false, value: i / 2 });
      }
    } else {
      for (let j = 0; j < value; j++) {
        fileBlocks.push({ isEmpty: true, value: 0 });
      }
    }
  });
  return fileBlocks;
};

const fileBlocks = constructFileBlocks(diskmap);

const orderedFileBlocks: { isEmpty: Boolean; value: number }[] = [];

const fileBlocksCopy = [...fileBlocks];

fileBlocksCopy.forEach((block, i) => {
  if (i < fileBlocks.length - 1) {
    if (!block.isEmpty) {
      orderedFileBlocks.push(block);
    } else {
      let block = fileBlocksCopy.pop();
      while (block!.isEmpty) block = fileBlocksCopy.pop();
      orderedFileBlocks.push(block!);
    }
  }
});

console.log(
  "Solution Part 1:",
  orderedFileBlocks
    .map((block, i) => block.value * i)
    .reduce((a, b) => a + b, 0)
);

// Part 2 - Move whole files to leftmost available space
const constructFileBlocksWithSizes = (diskmap: string) => {
  const files: {
    id: number;
    size: number;
    blocks: { isEmpty: boolean; value: number }[];
  }[] = [];
  let currentId = 0;

  diskmap.split("").forEach((char, i) => {
    const value = Number(char);
    if (i % 2 === 0) {
      const blocks: { isEmpty: boolean; value: number }[] = [];
      for (let j = 0; j < value; j++) {
        blocks.push({ isEmpty: false, value: currentId });
      }
      files.push({ id: currentId, size: value, blocks });
      currentId++;
    }
  });
  return files;
};

// Part 2
const files = constructFileBlocksWithSizes(diskmap);
const blocks = constructFileBlocks(diskmap);

// Process files in descending ID order
files
  .sort((a, b) => b.id - a.id)
  .forEach((file) => {
    // Find current position of file
    let currentPos = blocks.findIndex(
      (b, i) =>
        !b.isEmpty &&
        b.value === file.id &&
        blocks
          .slice(i, i + file.size)
          .every((b) => !b.isEmpty && b.value === file.id)
    );

    // Look for leftmost valid position
    for (let i = 0; i < currentPos; i++) {
      const span = blocks.slice(i, i + file.size);
      if (span.every((b) => b.isEmpty)) {
        // Move file here
        for (let j = 0; j < file.size; j++) {
          blocks[i + j] = { isEmpty: false, value: file.id };
        }
        // Clear old position
        for (let j = 0; j < file.size; j++) {
          blocks[currentPos + j] = { isEmpty: true, value: 0 };
        }
        break;
      }
    }
  });

// Calculate checksum
const checksum = blocks
  .map((block, i) => (block.isEmpty ? 0 : block.value * i))
  .reduce((a, b) => a + b, 0);

console.log("Part 2:", checksum);
