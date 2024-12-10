import * as fs from "fs";

const inputFilename = "input.txt";
// const inputFilename = "test_input.txt";
const input = fs.readFileSync(inputFilename, "utf-8").trim();

const lines = input.split("\n");

type Equation = { testValue: number; numbers: number[] };

const equations: Equation[] = lines.map((line) => {
  const [testValue, numbers] = line.split(": ");
  const numbersArray = numbers.split(" ").map(Number);
  return { testValue: Number(testValue), numbers: numbersArray };
});

enum Operator {
  Add = "+",
  Multiply = "*",
  Concatenate = "||",
}

const applyOperator = (
  equation: Equation,
  operator: Operator,
  operators: Operator[]
) => {
  if (equation.numbers.length === 1) {
    return equation.numbers[0] === equation.testValue;
  }
  let appliedEquation: Equation;
  switch (operator) {
    case Operator.Add:
      appliedEquation = {
        testValue: equation.testValue,
        numbers: [
          equation.numbers[0] + equation.numbers[1],
          ...equation.numbers.slice(2),
        ],
      };
      break;
    case Operator.Multiply:
      appliedEquation = {
        testValue: equation.testValue,
        numbers: [
          equation.numbers[0] * equation.numbers[1],
          ...equation.numbers.slice(2),
        ],
      };
      break;
    case Operator.Concatenate:
      appliedEquation = {
        testValue: equation.testValue,
        numbers: [
          Number(`${equation.numbers[0]}${equation.numbers[1]}`),
          ...equation.numbers.slice(2),
        ],
      };
      break;
  }

  const results = operators.map((operator) =>
    applyOperator(appliedEquation, operator, operators)
  );
  return results.some((result) => result);
};

const result1 = equations.reduce((acc, equation) => {
  return (
    acc +
    (applyOperator(equation, Operator.Add, [Operator.Add, Operator.Multiply]) ||
    applyOperator(equation, Operator.Multiply, [
      Operator.Add,
      Operator.Multiply,
    ])
      ? equation.testValue
      : 0)
  );
}, 0);

console.log("Part 1 Solution:", result1);

const result2 = equations.reduce((acc, equation) => {
  return (
    acc +
    (applyOperator(equation, Operator.Add, [
      Operator.Add,
      Operator.Multiply,
      Operator.Concatenate,
    ]) ||
    applyOperator(equation, Operator.Multiply, [
      Operator.Add,
      Operator.Multiply,
      Operator.Concatenate,
    ]) ||
    applyOperator(equation, Operator.Concatenate, [
      Operator.Add,
      Operator.Multiply,
      Operator.Concatenate,
    ])
      ? equation.testValue
      : 0)
  );
}, 0);

console.log("Part 2 Solution:", result2);
