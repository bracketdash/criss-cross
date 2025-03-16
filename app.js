const operatorInputs = document.querySelectorAll(".operator > input");
const solutionInputs = document.querySelectorAll(".solution > input");
const blankCells = document.querySelectorAll(".blank");

const ops = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  X: (a, b) => a * b,
  "/": (a, b) => a / b,
};

const inputClass = {
  "+": "add",
  "-": "subtract",
  X: "multiply",
  "/": "divide",
};

function fitsAllClues(o, s, p) {
  const equations = [
    [p[0], o[0], p[1], o[1], p[2]],
    [p[3], o[5], p[4], o[6], p[5]],
    [p[6], o[10], p[7], o[11], p[8]],
    [p[0], o[2], p[3], o[7], p[6]],
    [p[1], o[3], p[4], o[8], p[7]],
    [p[2], o[4], p[5], o[9], p[8]],
  ];
  return equations.every((eq, i) => {
    return ops[eq[3]](ops[eq[1]](eq[0], eq[2]), eq[4]) === s[i];
  });
}

function solve(operators, solutions) {
  const perm = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (fitsAllClues(operators, solutions, [...perm])) {
    return perm;
  }
  const counts = new Array(9).fill(0);
  let i = 0;
  while (i < 9) {
    if (counts[i] < i) {
      if (i % 2 === 0) {
        const temp = perm[0];
        perm[0] = perm[i];
        perm[i] = temp;
      } else {
        const temp = perm[counts[i]];
        perm[counts[i]] = perm[i];
        perm[i] = temp;
      }
      if (fitsAllClues(operators, solutions, [...perm])) {
        return perm;
      }
      counts[i]++;
      i = 0;
    } else {
      counts[i] = 0;
      i++;
    }
  }
  return null;
}

function resetBlanks() {
  blankCells.forEach((cell) => {
    cell.innerHTML = "";
  });
}

function checkBoard() {
  const allFilledIn = [...operatorInputs, ...solutionInputs].every(
    ({ value }) => value.length
  );
  if (!allFilledIn) {
    resetBlanks();
    return;
  }
  const operators = [...operatorInputs].map(({ value }) => value);
  const solutions = [...solutionInputs].map(({ value }) => parseInt(value, 10));
  const winningPermutation = solve(operators, solutions);
  if (!winningPermutation) {
    resetBlanks();
    return;
  }
  blankCells.forEach((cell, index) => {
    cell.innerHTML = winningPermutation[index];
  });
}

function handleKeyupOperator({ target }) {
  const value = target.value
    .replace(/[^-+*xX\\/%÷]/, "")
    .replace(/[*xX]/, "X")
    .replace(/[\\/%÷]/, "/");
  if (target.value !== value) {
    target.value = value;
  }
  target.className = inputClass[value];
  if (value.length) {
    checkBoard();
  } else {
    resetBlanks();
  }
}

function handleKeyupSolution({ target }) {
  let value = target.value;
  if (parseInt(value, 10) > 504) {
    value = 504;
    target.value = 504;
  }
  if (value.length) {
    checkBoard();
  } else {
    resetBlanks();
  }
}

operatorInputs.forEach((el) => {
  el.addEventListener("keyup", handleKeyupOperator);
});

solutionInputs.forEach((el) => {
  el.addEventListener("keyup", handleKeyupSolution);
});

operatorInputs[0].focus();
