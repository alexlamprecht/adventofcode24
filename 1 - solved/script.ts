import * as fs from "fs";

// Read the input file
const input = fs.readFileSync("input.txt", "utf-8");

// minimize multiple space to only a single space in the input but keep the newlines
const minimizedInput = input.replace(/ +/g, " ");

// Split the input into lines
const lines = minimizedInput.split("\n");

// Initialize the arrays
const array1: number[] = [];
const array2: number[] = [];

// Iterate over each line and extract the numbers
lines.forEach((line) => {
  const [num1, num2] = line.split(" ").map(Number);
  array1.push(num1);
  array2.push(num2);
});

array1.sort((a, b) => a - b);
array2.sort((a, b) => a - b);

const result_part1 = array1
  .map((num, index) => Math.abs(num - array2[index]))
  .reduce((acc, curr) => acc + curr, 0);

console.log("Result for Part 1:", result_part1);

const numberCount = {};

array1.forEach((element) => {
  numberCount[element] = array2.filter((num) => num === element).length;
});

const result_part2 = Object.entries(numberCount).reduce((acc, curr) => {
  return Number(curr[0]) * Number(curr[1]) + acc;
}, 0);

console.log("Result for Part 2:", result_part2);
