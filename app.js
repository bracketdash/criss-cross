const operatorInputs = document.querySelectorAll(".operator > input");
const solutionInputs = document.querySelectorAll(".solution > input");
const blankCells = document.querySelectorAll(".blank");

function fitsAllClues(board, permutation) {
  // TODO
}

function solve(board) {
  const perm = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (fitsAllClues(board, [...perm])) {
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
      if (fitsAllClues(board, [...perm])) {
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
  const operatorValues = [...operatorInputs].map(({ value }) => value);
  const solutionValues = [...solutionInputs].map(({ value }) => value);
  const winningPermutation = solve([
    [...operatorValues.slice(0, 2), solutionValues[0]],
    operatorValues.slice(2, 5),
    [...operatorValues.slice(5, 7), solutionValues[1]],
    operatorValues.slice(7, 10),
    [...operatorValues.slice(10, 12), solutionValues[2]],
    solutionValues.slice(3, 6),
  ]);
  if (!winningPermutation) {
    resetBlanks();
    // TODO: inform the user a solution couldn't be found
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
  if (value.length) {
    checkBoard();
  } else {
    resetBlanks();
  }
}

function handleKeyupSolution({ target }) {
  let value = target.value.replace(/[^0-9]/, "");
  if (parseInt(value, 10) > 504) {
    value = 504;
  }
  target.value = value;
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
