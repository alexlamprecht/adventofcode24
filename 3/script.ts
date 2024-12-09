import * as fs from "fs";

// Read the input file
const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();

const lines = input.split("\n");

const addMulStatements = (line: string) => {
  return line
    .split("mul(")
    .map((expression) => expression.split(")"))
    .filter((expression) => expression.length > 1)
    .map((expression) => expression[0])
    .map((expression) => expression.split(",").map(Number))
    .filter((numbers) => numbers.every((number) => !isNaN(number)))
    .reduce((acc, curr) => acc + curr[0] * curr[1], 0);
};

console.log(
  "Part 1 Result:",
  lines.reduce((acc, curr) => acc + addMulStatements(curr), 0)
);

const second = (input: string) => {
  let result = 0;
  const regex =
    /(?<=(?:do\(\)|^)(?:[^d]|d(?!on't\(\)))*)mul\((\d{1,3}),(\d{1,3})\)/g;
  const matches = input.matchAll(regex);

  for (const match of matches) {
    result += Number(match[1]) * Number(match[2]);
  }
  return result;
};

console.log("Part 2 Result:", second(input));
