import * as fs from "fs";

// Read the input file
const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();

const lines = input.split("\n");
const letters = lines.map((line) => line.split(""));

const height = letters.length;
const width = letters[0].length;

const countOccurrences = (text: string, word: string): number => {
  // Convert both strings to same case for case-insensitive matching
  const normalizedText = text.toLowerCase();
  const normalizedWord = word.toLowerCase();

  // Use regex to find all non-overlapping matches
  const regex = new RegExp(normalizedWord, "g");
  const matches = normalizedText.match(regex);

  return matches ? matches.length : 0;
};

const word = "XMAS";
// Create array of strings for each direction
const allDirections = [
  // Right - original matrix
  letters.map((row) => row.join("")).join(" "),

  // Left - reverse each row
  letters.map((row) => [...row].reverse().join("")).join(" "),

  // Down - transpose matrix
  Array(width)
    .fill(0)
    .map((_, i) =>
      Array(height)
        .fill(0)
        .map((_, j) => letters[j][i])
        .join("")
    )
    .join(" "),

  // Up - transpose and reverse rows
  Array(width)
    .fill(0)
    .map((_, i) =>
      Array(height)
        .fill(0)
        .map((_, j) => letters[j][i])
        .reverse()
        .join("")
    )
    .join(" "),

  // Diagonal down-right
  Array(height + width - 1)
    .fill(0)
    .map((_, i) => {
      const row: string[] = [];
      for (let j = 0; j <= i; j++) {
        const x = j;
        const y = i - j;
        if (x < width && y < height) {
          row.push(letters[y][x]);
        }
      }
      return row.join("");
    })
    .join(" "),

  // Diagonal down-left
  Array(height + width - 1)
    .fill(0)
    .map((_, i) => {
      const row: string[] = [];
      for (let j = 0; j <= i; j++) {
        const x = width - 1 - j;
        const y = i - j;
        if (x >= 0 && y < height) {
          row.push(letters[y][x]);
        }
      }
      return row.join("");
    })
    .join(" "),

  // Diagonal up-right
  Array(height + width - 1)
    .fill(0)
    .map((_, i) => {
      const row: string[] = [];
      for (let j = 0; j <= i; j++) {
        const x = j;
        const y = height - 1 - (i - j);
        if (x < width && y >= 0) {
          row.push(letters[y][x]);
        }
      }
      return row.join("");
    })
    .join(" "),

  // Diagonal up-left
  Array(height + width - 1)
    .fill(0)
    .map((_, i) => {
      const row: string[] = [];
      for (let j = 0; j <= i; j++) {
        const x = width - 1 - j;
        const y = height - 1 - (i - j);
        if (x >= 0 && y >= 0) {
          row.push(letters[y][x]);
        }
      }
      return row.join("");
    })
    .join(" "),
];

console.log(
  "Solution Part 1:",
  allDirections
    .map((direction) => countOccurrences(direction, word))
    .reduce((a, b) => a + b, 0)
);

const patterns = [
  [
    ["M", null, "S"],
    [null, "A", null],
    ["M", null, "S"],
  ],
  [
    ["M", null, "M"],
    [null, "A", null],
    ["S", null, "S"],
  ],
  [
    ["S", null, "M"],
    [null, "A", null],
    ["S", null, "M"],
  ],
  [
    ["S", null, "S"],
    [null, "A", null],
    ["M", null, "M"],
  ],
];

function checkPattern(
  letters: string[][],
  startY: number,
  startX: number,
  pattern: (string | null)[][]
): boolean {
  // Check if pattern would go out of bounds
  if (
    startY + pattern.length > letters.length ||
    startX + pattern[0].length > letters[0].length
  ) {
    return false;
  }

  // Check each position in the pattern
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[0].length; x++) {
      const patternChar = pattern[y][x];
      // Skip null positions in pattern
      if (patternChar === null) continue;

      // If letter doesn't match pattern, return false
      if (letters[startY + y][startX + x] !== patternChar) {
        return false;
      }
    }
  }
  return true;
}

let xMasCount = 0;
// Iterate through each position in the letters matrix
for (let y = 0; y < letters.length; y++) {
  for (let x = 0; x < letters[0].length; x++) {
    // Check each pattern starting at this position
    patterns.forEach((pattern) => {
      if (checkPattern(letters, y, x, pattern)) {
        xMasCount++;
      }
    });
  }
}

console.log("Solution Part 2:", xMasCount);
