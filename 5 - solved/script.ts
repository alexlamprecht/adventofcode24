import * as fs from "fs";

const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();

const [rulesInput, updatesInput] = input.split("\n\n");

const rules = new Map<number, Set<number>>();
rulesInput.split("\n").forEach((rule) => {
  const [a, b] = rule.split("|").map(Number);
  if (!rules.has(a)) rules.set(a, new Set());
  rules.get(a)!.add(b);
});

const updates = updatesInput
  .split("\n")
  .map((update) => update.split(",").map(Number));

const isValidUpdate = (update: number[]): boolean => {
  const positions = new Map(update.map((num, i) => [num, i]));

  for (let i = 0; i < update.length; i++) {
    const current = update[i];
    if (rules.has(current)) {
      const mustBeAfter = rules.get(current)!;
      for (const after of mustBeAfter) {
        if (positions.has(after)) {
          if (positions.get(after)! <= i) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

const sum = updates
  .filter(isValidUpdate)
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((sum, num) => sum + num, 0);

console.log("Solution Part 1:", sum);

// New function to sort an update according to rules
const sortUpdate = (update: number[]): number[] => {
  // Convert array to Set for O(1) lookups
  const nums = new Set(update);

  // Build a graph of dependencies
  const before = new Map<number, Set<number>>();
  const after = new Map<number, Set<number>>();

  // Initialize maps
  update.forEach((num) => {
    before.set(num, new Set());
    after.set(num, new Set());
  });

  // Fill in dependencies based on rules
  update.forEach((num) => {
    if (rules.has(num)) {
      rules.get(num)!.forEach((mustBeAfter) => {
        if (nums.has(mustBeAfter)) {
          before.get(mustBeAfter)!.add(num);
          after.get(num)!.add(mustBeAfter);
        }
      });
    }
  });

  // Sort based on dependencies
  return update.slice().sort((a, b) => {
    if (before.get(a)!.has(b)) return 1;
    if (before.get(b)!.has(a)) return -1;
    return 0;
  });
};

const sum2 = updates
  .filter((update) => !isValidUpdate(update))
  .map(sortUpdate)
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((sum, num) => sum + num, 0);

console.log("Solution Part 2:", sum2);
