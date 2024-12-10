import * as fs from "fs";

const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();

const letters = input.split("\n").map((line) => line.split(""));

const maxX = letters[0].length;
const maxY = letters.length;

const initialObstacles: Set<string> = new Set(
  letters.reduce((acc: string[], row, y) => {
    row.forEach((char, x) => {
      if (char === "#") {
        acc.push(`${x}-${y}`);
      }
    });
    return acc;
  }, [])
);

let initialPlayerPosition: [number, number] = [
  letters[letters.findIndex((row) => row.includes("^"))].findIndex(
    (char) => char === "^"
  ),
  letters.findIndex((row) => row.includes("^")),
];

enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

let initialPlayerDirection = Direction.Up;

const getNextPosition = (
  position: [number, number],
  direction: Direction
): [number, number] => {
  switch (direction) {
    case Direction.Up:
      return [position[0], position[1] - 1];
    case Direction.Down:
      return [position[0], position[1] + 1];
    case Direction.Left:
      return [position[0] - 1, position[1]];
    case Direction.Right:
      return [position[0] + 1, position[1]];
  }
};

const turnRight = (direction: Direction) => {
  switch (direction) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Right:
      return Direction.Down;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
  }
};

const isNextStepObstacle = (
  obstacles: Set<string>,
  position: [number, number]
) => {
  return obstacles.has(position.join("-"));
};

const isOutOfBounds = (position: [number, number]) => {
  return (
    position[0] < 0 ||
    position[0] >= maxX ||
    position[1] < 0 ||
    position[1] >= maxY
  );
};

const getVisitedLocation = (
  position: [number, number],
  direction?: Direction
) => {
  return `${position[0]}-${position[1]}${direction ? `-${direction}` : ""}`;
};

const runThroughMap = (
  obstacles: Set<string>,
  playerPosition: [number, number],
  playerDirection: Direction
): Set<String> => {
  const visitedLocations = new Set<String>();
  const visitedLocationsWithDirection = new Set<String>();

  visitedLocationsWithDirection.add(
    getVisitedLocation(playerPosition, playerDirection)
  );
  visitedLocations.add(getVisitedLocation(playerPosition));

  while (true) {
    const nextPosition = getNextPosition(playerPosition, playerDirection);
    if (isNextStepObstacle(obstacles, nextPosition)) {
      playerDirection = turnRight(playerDirection);
      continue;
    }

    playerPosition = nextPosition;
    if (isOutOfBounds(playerPosition)) {
      break;
    }
    visitedLocations.add(getVisitedLocation(playerPosition));
    if (
      visitedLocationsWithDirection.has(
        getVisitedLocation(playerPosition, playerDirection)
      )
    ) {
      throw new Error("Loop detected");
    }
    visitedLocationsWithDirection.add(
      getVisitedLocation(playerPosition, playerDirection)
    );
  }

  // console.log("visitedLocationsWithDirection", visitedLocationsWithDirection);
  return visitedLocations;
};

console.log(
  "Solution Part 1:",
  runThroughMap(initialObstacles, initialPlayerPosition, initialPlayerDirection)
    .size
);

let numberOfLoops = 0;
for (let x = 0; x < maxX; x++) {
  for (let y = 0; y < maxY; y++) {
    const obstacles = new Set(initialObstacles);
    obstacles.add(`${x}-${y}`);
    try {
      runThroughMap(obstacles, initialPlayerPosition, initialPlayerDirection);
    } catch (e) {
      console.log("Loop detected at", x, y);
      numberOfLoops++;
    }
  }
}

console.log("Solution Part 2:", numberOfLoops);
