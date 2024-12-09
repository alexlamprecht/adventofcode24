import * as fs from "fs";

// Read the input file
const input = fs.readFileSync("input.txt", "utf-8");

const lines = input.replace(/ +/g, " ").replace(/\t+/g, " ").split("\n");

let safeReportCountPart1 = 0;
let safeReportCountPart2 = 0;

const isValid = (report: number[]) =>
  report.every(
    (value, index, array) =>
      index === 0 ||
      (Math.abs(value - array[index - 1]) <= 3 &&
        Math.abs(value - array[index - 1]) >= 1)
  ) &&
  (report.every(
    (value, index, array) => index === 0 || value >= array[index - 1]
  ) ||
    report.every(
      (value, index, array) => index === 0 || value <= array[index - 1]
    ));

lines.forEach((line) => {
  const reportNumbers = line.split(" ").map(Number);
  safeReportCountPart1 += +isValid(reportNumbers);
  safeReportCountPart2 += +reportNumbers.some((_, index) =>
    isValid(reportNumbers.filter((_, filterIndex) => filterIndex !== index))
  );
});
console.log("Safe report count Part 1:", safeReportCountPart1);
console.log("Safe report count Part 2:", safeReportCountPart2);
