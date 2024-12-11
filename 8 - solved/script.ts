import * as fs from "fs";

const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();

const matrix = input.split("\n").map((line) => line.split(""));

const maxX = matrix[0].length;
const maxY = matrix.length;

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index && ![".", ","].includes(value);
}

var antennaFrequencies = matrix.join("").split("").filter(onlyUnique);

const antennaLocations: { [key: string]: [number, number][] } = {};

for (let y = 0; y < maxY; y++) {
  for (let x = 0; x < maxX; x++) {
    const cell = matrix[y][x];
    if (antennaFrequencies.includes(cell)) {
      if (!antennaLocations[cell]) {
        antennaLocations[cell] = [];
      }
      antennaLocations[cell].push([x, y]);
    }
  }
}

const antennaLocationsSet = new Set<string>();

for (let [_, locations] of Object.entries(antennaLocations)) {
  for (let location of locations) {
    antennaLocationsSet.add(location.join(","));
  }
}

const antinodeFrequencyLocations = new Set<string>();
const antinodeFrequencyLocationsPart2 = new Set<string>();

for (let [_, locations] of Object.entries(antennaLocations)) {
  for (let location of locations) {
    for (let permutation of locations) {
      const permutationDifference = [
        location[0] - permutation[0],
        location[1] - permutation[1],
      ];
      const antinodeLocation = [
        location[0] + permutationDifference[0],
        location[1] + permutationDifference[1],
      ];
      if (
        !(permutationDifference[0] === 0) &&
        !(permutationDifference[1] === 0) &&
        antinodeLocation[0] >= 0 &&
        antinodeLocation[0] < maxX &&
        antinodeLocation[1] >= 0 &&
        antinodeLocation[1] < maxY
      ) {
        antinodeFrequencyLocations.add(antinodeLocation.join(","));
      }
      let multiplier = 1;
      while (multiplier < Math.max(maxX, maxY)) {
        const antinodeLocation = [
          location[0] + permutationDifference[0] * multiplier,
          location[1] + permutationDifference[1] * multiplier,
        ];
        if (
          antinodeLocation[0] >= 0 &&
          antinodeLocation[0] < maxX &&
          antinodeLocation[1] >= 0 &&
          antinodeLocation[1] < maxY
        ) {
          antinodeFrequencyLocationsPart2.add(antinodeLocation.join(","));
        }
        multiplier++;
      }
    }
  }
}
console.log("Solution Part 1", antinodeFrequencyLocations.size);
console.log("Solution Part 2", antinodeFrequencyLocationsPart2.size);

// // Visualize antinodes in a matrix format
// const visualMatrix: string[][] = Array(maxY)
//   .fill(null)
//   .map(() => Array(maxX).fill("."));

// // Mark all antinode locations with '#'
// for (const location of antinodeFrequencyLocationsPart2) {
//   const [x, y] = location.split(",").map(Number);
//   visualMatrix[y][x] = "#";
// }
// // Mark all antenna locations with their frequency
// for (const [frequency, locations] of Object.entries(antennaLocations)) {
//   for (const location of locations) {
//     const [x, y] = location;
//     visualMatrix[y][x] = frequency;
//   }
// }

// // Print the visualization
// console.log("\nAntinode Visualization (Part 2):");
// visualMatrix.forEach((row) => console.log(row.join("")));
