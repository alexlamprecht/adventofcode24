import * as fs from "fs";

const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();
