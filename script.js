// DOM ELEMENTS
const boardElem = document.querySelector('.board');
const numpadElem = document.querySelector('.numpad');
const faderElem = document.querySelector('.fader');
const messageElem = document.querySelector('.message');
const choiceButtonsElem = document.querySelectorAll('.choice-btn');
const name = document.querySelector('#name');
const warning = document.querySelector('#warning');
const choiceNo = document.querySelector('#choice-no');
const choiceYes = document.querySelector('#choice-yes');
const themeButtonsElem = document.querySelectorAll('.theme-btn');
const sizeButtonsElem = document.querySelectorAll('.size-btn');
const resetButtonElem = document.querySelector('#reset-btn');
const checkButtonElem = document.querySelector('#check-btn');
const changeThemeButtonElem = document.querySelector('#change-theme-btn');
let subGridsElem = {};
let cellsElem = {};
let keysElem = {};

// EVENT LISTENERS
themeButtonsElem.forEach((button) => button.addEventListener('click', setTheme));
choiceButtonsElem.forEach((button) => button.addEventListener('click', handleChoice));
sizeButtonsElem.forEach((button) => button.addEventListener('focus', showMessage));
resetButtonElem.addEventListener('click', showMessage);
checkButtonElem.addEventListener('click', showMessage);
changeThemeButtonElem.addEventListener('click', changeTheme);
faderElem.addEventListener('click', () => document.getElementById('choice-no').click());
document.addEventListener('keydown', (e) => {
  const key = e.key;
  switch (key) {
    case 'Escape':
      document.getElementById('choice-no').click();
      break;
    case 'q':
      document.getElementById('theme-0').click();
      break;
    case 'w':
      document.getElementById('theme-1').click();
      break;
    case 'e':
      document.getElementById('theme-2').click();
      break;
    case 'r':
      document.getElementById('theme-3').click();
      break;
    case 't':
      document.getElementById('theme-4').click();
      break;
    case 'y':
      document.getElementById('theme-5').click();
      break;
    case 'u':
      document.getElementById('theme-6').click();
      break;
    case 'i':
      document.getElementById('theme-7').click();
      break;
    case 'o':
      document.getElementById('theme-8').click();
      break;
    case 'p':
      document.getElementById('theme-9').click();
      break;
    case 'a':
      document.getElementById('size-4').focus();
      break;
    case 's':
      document.getElementById('size-9').focus();
      break;
    case 'd':
      document.getElementById('size-16').focus();
      break;
    case 'z':
      resetButtonElem.click();
      break;
    case 'x':
      checkButtonElem.click();
      break;
    case 'c':
      changeThemeButtonElem.click();
      break;
  }
});

let nextSize = 9;
let currentTheme = 0;

start();

// FUNCTIONS
// Load the page for the first time, along with the first puzzle
function start() {
  puzzle = generatePuzzle(nextSize);
  displayBoard(puzzle);
  updatePage();
}

// Automatically check whether the user completed the puzzle correctly or not, when there are no more empty cells
function checkWin() {
  let board = readBoard();
  console.log(board);
  for (let row of board) {
    if (row.includes(NaN)) {
      return;
    }
  }
  checkButtonElem.click();
}

// Rewrite the board in the HTML element as a Javascript array
function readBoard() {
  let tempBoard = [];
  for (let sub of boardElem.childNodes) {
    let subGrid = [];
    for (let cell of sub.childNodes) {
      subGrid.push(cell.innerText);
    }
    tempBoard.push(subGrid);
  }
  return dehexify(getSubGrids(tempBoard, subGridsElem.length, Math.sqrt(subGridsElem.length)));
}

// Grab elements from the HTML DOM and add event listeners
function updatePage() {
  subGridsElem = document.querySelectorAll('.subgrid');

  cellsElem = document.querySelectorAll('.cell');
  cellsElem.forEach((cell) => cell.addEventListener('click', handleSelect));

  displayNumpad();
  keysElem = document.querySelectorAll('.key');
  keysElem.forEach((key) => key.addEventListener('click', handleNumpadClick));

  cellsElem[0].click();
}

// Handle event when user chooses an option on the message displayed
function handleChoice(e) {
  switch (e.target.id) {
    case 'choice-yes':
      if (nextSize) {
        puzzle = generatePuzzle(nextSize);
        displayBoard(puzzle);
        updatePage();
      } else {
        cellsElem.forEach((cell) => {
          if (!cell.classList.contains('fixed')) {
            cell.innerText = '';
          }
        });
      }
    case 'choice-no':
      faderElem.style.display = 'none';
      messageElem.style.display = 'none';
      cellsElem[0].click();
      break;
  }
}

// Show message alerting the user about irreversible action and asking for confirmation
function showMessage(e) {
  name.innerText = '- NEW GAME- ';
  warning.innerText =
    'This action will create a new game and you will lose progress on the current one. Do you wish to continue?';
  choiceNo.innerText = 'Cancel';
  choiceYes.innerText = 'New Game';

  switch (e.target.id) {
    case 'size-4':
      nextSize = 4;
      break;
    case 'size-9':
      nextSize = 9;
      break;
    case 'size-16':
      nextSize = 16;
      break;
    case 'reset-btn':
      nextSize = false;
      name.innerText = '- CLEAR BOARD -';
      warning.innerText =
        'This action will clear / reset the board and you will lose progress on this puzzle. Do you wish to continue?';
      choiceNo.innerText = 'Cancel';
      choiceYes.innerText = 'Clear Board';
      break;
    case 'check-btn':
      nextSize = subGridsElem.length;
      let solved = readBoard();
      if (isValidSolution(solved)) {
        name.innerText = '- CHECK ANSWER -';
        warning.innerText =
          'Congratulations! You solved this sudoku puzzle! Do you wish to start the next one?';
        choiceNo.innerText = 'Cancel';
        choiceYes.innerText = 'Next Puzzle';
      } else {
        name.innerText = '- CHECK ANSWER -';
        warning.innerText = 'Hmm, not quite right. Do you want to keep trying a little more?';
        choiceNo.innerText = 'Yes, I will get it!';
        choiceYes.innerText = 'Next Puzzle';
      }
      break;
  }
  faderElem.style.display = 'block';
  messageElem.style.display = 'block';
}

// Change the page's theme to the next theme when using smaller screens
function changeTheme() {
  currentTheme++;
  currentTheme = currentTheme > 9 ? currentTheme - 10 : currentTheme;
  themeButtonsElem[currentTheme].click();
}

// Set the theme and color scheme for the page
function setTheme(e) {
  switch (e.target.id) {
    case 'theme-0':
      document.documentElement.style.setProperty('--main', '#111');
      document.documentElement.style.setProperty('--light', '#555');
      document.documentElement.style.setProperty('--lighter', '#CCC');
      document.documentElement.style.setProperty('--lightest', '#EEE');
      document.documentElement.style.setProperty('--background', '#EEEEEE55');
      break;
    case 'theme-1':
      document.documentElement.style.setProperty('--main', '#2C3333');
      document.documentElement.style.setProperty('--light', '#395B64');
      document.documentElement.style.setProperty('--lighter', '#A5C9CA');
      document.documentElement.style.setProperty('--lightest', '#E7F6F2');
      document.documentElement.style.setProperty('--background', '#E7F6F255');
      break;
    case 'theme-2':
      document.documentElement.style.setProperty('--main', '#553C8B');
      document.documentElement.style.setProperty('--light', '#9EA9F0');
      document.documentElement.style.setProperty('--lighter', '#CCC1FF');
      document.documentElement.style.setProperty('--lightest', '#FFEAFE');
      document.documentElement.style.setProperty('--background', '#FFEAFE55');
      break;
    case 'theme-3':
      document.documentElement.style.setProperty('--main', '#00005C');
      document.documentElement.style.setProperty('--light', '#6A097D');
      document.documentElement.style.setProperty('--lighter', '#C060A1');
      document.documentElement.style.setProperty('--lightest', '#FFDCB4');
      document.documentElement.style.setProperty('--background', '#FFDCB455');
      break;
    case 'theme-4':
      document.documentElement.style.setProperty('--main', '#1B262C');
      document.documentElement.style.setProperty('--light', '#0F4C75');
      document.documentElement.style.setProperty('--lighter', '#3282B8');
      document.documentElement.style.setProperty('--lightest', '#BBE1FA');
      document.documentElement.style.setProperty('--background', '#BBE1FA55');
      break;
    case 'theme-5':
      document.documentElement.style.setProperty('--main', '#3D0E1E');
      document.documentElement.style.setProperty('--light', '#D1274B');
      document.documentElement.style.setProperty('--lighter', '#F88020');
      document.documentElement.style.setProperty('--lightest', '#FFF4E4');
      document.documentElement.style.setProperty('--background', '#FFF4E455');
      break;
    case 'theme-6':
      document.documentElement.style.setProperty('--main', '#1B1919');
      document.documentElement.style.setProperty('--light', '#616F39');
      document.documentElement.style.setProperty('--lighter', '#A7D129');
      document.documentElement.style.setProperty('--lightest', '#F8EEB4');
      document.documentElement.style.setProperty('--background', '#F8EEB455');
      break;
    case 'theme-7':
      document.documentElement.style.setProperty('--main', '#00334E');
      document.documentElement.style.setProperty('--light', '#145374');
      document.documentElement.style.setProperty('--lighter', '#5588A3');
      document.documentElement.style.setProperty('--lightest', '#E8E8E8');
      document.documentElement.style.setProperty('--background', '#E8E8E855');
      break;
    case 'theme-8':
      document.documentElement.style.setProperty('--main', '#2C3639');
      document.documentElement.style.setProperty('--light', '#3F4E4F');
      document.documentElement.style.setProperty('--lighter', '#A27B5C');
      document.documentElement.style.setProperty('--lightest', '#DCD7C9');
      document.documentElement.style.setProperty('--background', '#DCD7C955');
      break;
    case 'theme-9':
      document.documentElement.style.setProperty('--main', '#060930');
      document.documentElement.style.setProperty('--light', '#333456');
      document.documentElement.style.setProperty('--lighter', '#595B83');
      document.documentElement.style.setProperty('--lightest', '#F4ABC4');
      document.documentElement.style.setProperty('--background', '#F4ABC455');
      break;
  }
}

// Handles the event whenever a cell is clicked on
function handleSelect(e) {
  const cell = e.target;
  const cellClasses = [...cell.classList.values()];

  // Exclude the classes '.cell' and '.fixed' otherwise other cells would be related and therefore highlighted
  cellClasses.splice(cellClasses.indexOf('cell'), 1);
  if (cellClasses.includes('fixed')) {
    cellClasses.splice(cellClasses.indexOf('fixed'), 1);
  }

  // Create an array to store all cells that are related to the selected cell by line, column or sub-grid
  const related = [];

  // Remove any classes added in from the previous click
  [...cellsElem].forEach((cell) => cell.classList.remove('related', 'same-number'));

  for (let element of [...cellsElem]) {
    if (cellClasses.some((cellClass) => element.classList.contains(cellClass))) {
      related.push(element);
    }
  }

  const sameNumber = [...cellsElem].filter(
    (element) => element.innerText === cell.innerText && element.innerText !== ''
  );

  // Assign styling classes to the selected cell, related cells, and cells already filled with the same number as the selected cell
  related.forEach((element) => element.classList.add('related'));
  sameNumber.forEach((element) => element.classList.add('same-number'));
  [...cellsElem].forEach((cell) => cell.classList.remove('selected-cell'));
  cell.classList.add('selected-cell');

  // Add option to navigate through the board via keyboard
  cell.focus();
  cell.addEventListener('keydown', function handleKeyDown(event) {
    let size = subGridsElem.length;
    let key = event.key;

    switch (key) {
      case 'Backspace':
        if (!cell.classList.contains('fixed')) {
          cell.innerText = '';
        }
        break;
      case 'ArrowUp':
        if (handleArrows(cell, 'up')) {
          cell.removeEventListener('keydown', handleKeyDown);
        }
        break;
      case 'ArrowRight':
        if (handleArrows(cell, 'right')) {
          cell.removeEventListener('keydown', handleKeyDown);
        }
        break;
      case 'ArrowDown':
        if (handleArrows(cell, 'down')) {
          cell.removeEventListener('keydown', handleKeyDown);
        }
        break;
      case 'ArrowLeft':
        if (handleArrows(cell, 'left')) {
          cell.removeEventListener('keydown', handleKeyDown);
        }
        break;
      default:
        switch (size) {
          case 4:
            if (/[1-4]/.test(key) && key.length === 1 && !cell.classList.contains('fixed')) {
              cell.innerText = key;
            }
            break;
          case 9:
            if (/[1-9]/.test(key) && key.length === 1 && !cell.classList.contains('fixed')) {
              cell.innerText = key;
            }
            break;
          case 16:
            if (/[1-9a-g]/i.test(key) && key.length === 1 && !cell.classList.contains('fixed')) {
              cell.innerText = key.toUpperCase();
            }
            break;
          default:
            break;
        }
    }
    checkWin();
  });
}

// Handle event when an arrow key is pressed on the keyboard
function handleArrows(cell, direction) {
  let lineClass = [...cell.classList.values()].filter((className) => /line/.test(className)).pop();
  let line = parseInt(lineClass.match(/\d/g).join(''));
  let columnClass = [...cell.classList.values()]
    .filter((className) => /column/.test(className))
    .pop();
  let column = parseInt(columnClass.match(/\d/g).join(''));

  switch (direction) {
    case 'up':
      if (line - 1 > 0) {
        document.querySelector(`.line-${line - 1}.column-${column}`).click();
      } else {
        return false;
      }
      break;
    case 'right':
      if (column + 1 <= subGridsElem.length) {
        document.querySelector(`.line-${line}.column-${column + 1}`).click();
      } else {
        return false;
      }
      break;
    case 'down':
      if (line + 1 <= subGridsElem.length) {
        document.querySelector(`.line-${line + 1}.column-${column}`).click();
      } else {
        return false;
      }
      break;
    case 'left':
      if (column - 1 > 0) {
        document.querySelector(`.line-${line}.column-${column - 1}`).click();
      } else {
        return false;
      }
      break;
  }
  return true;
}

// Handle event when user clicks a numpad key
function handleNumpadClick(e) {
  const selectedCellElem = document.querySelector('.selected-cell');
  if (!selectedCellElem.classList.contains('fixed')) {
    selectedCellElem.innerText = e.target.innerText;
  }
  selectedCellElem.focus();
  checkWin();
}

// Display numpad on the HTML page
function displayNumpad() {
  size = subGridsElem.length;
  while (numpadElem.hasChildNodes()) {
    numpadElem.removeChild(numpadElem.firstChild);
  }
  for (let i = 1; i <= size; i++) {
    const key = document.createElement('div');
    key.classList.add('key', `key-${i}`);
    key.innerText = i < 10 ? i : String.fromCharCode(i + 55);
    numpadElem.appendChild(key);
  }
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fa-solid', 'fa-delete-left');
  const deleteKey = document.createElement('div');
  deleteKey.classList.add('key', 'key-delete');
  deleteKey.appendChild(deleteIcon);
  numpadElem.appendChild(deleteKey);
}

// Display a sudoku board on the HTML page
function displayBoard(board) {
  let boardSize = board.length;
  let subSize = Math.sqrt(boardSize);

  // So the CSS grid can wrap the cells correctly
  document.documentElement.style.setProperty('--sub-size', `${subSize}`);

  // Scales the board according to the puzzle size
  switch (boardSize) {
    case 4:
      document.documentElement.style.setProperty('--board-size', '300px');
      break;
    case 9:
      document.documentElement.style.setProperty('--board-size', '520px');
      break;
    case 16:
      document.documentElement.style.setProperty('--board-size', '650px');
      break;
  }

  board = hexify(board);

  const subGrids = JSON.parse(JSON.stringify(getSubGrids(board, boardSize, subSize)));

  // Remove any child elements that the board may already have
  while (boardElem.hasChildNodes()) {
    boardElem.removeChild(boardElem.firstChild);
  }

  // Create the elements in the grid and assign their respective classes
  for (let i = 1; i <= boardSize; i++) {
    const subGrid = document.createElement('div');
    subGrid.classList.add('subgrid', `subgrid-${i}`);
    for (let j = 1; j <= boardSize; j++) {
      const cell = document.createElement('div');
      const line = Math.floor((i - 1) / subSize) * subSize + Math.floor((j - 1) / subSize) + 1;
      const column = ((i - 1) % subSize) * subSize + ((j - 1) % subSize) + 1;
      cell.classList.add('cell', `line-${line}`, `column-${column}`, `subgrid-${i}`);
      cell.setAttribute('tabindex', '0');
      if (subGrids[i - 1][j - 1] === 0) {
        cell.innerText = '';
      } else {
        cell.innerText = subGrids[i - 1][j - 1];
        cell.classList.add('fixed');
      }
      subGrid.appendChild(cell);
    }
    boardElem.appendChild(subGrid);
  }
}

// Generate a random solvable 4x4, 9x9 or 16x16 sudoku puzzle
function generatePuzzle(boardSize) {
  let subSize = Math.sqrt(boardSize);

  let board = [];
  let tempBoard = [];

  // Set initial boards depending on board size
  switch (boardSize) {
    case 4:
      board = [
        [3, 4, 2, 1],
        [1, 2, 4, 3],

        [4, 1, 3, 2],
        [2, 3, 1, 4],
      ];
      break;
    case 9:
      board = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],

        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],

        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];
      break;
    case 16:
      const [A, B, C, D, E, F, G] = [10, 11, 12, 13, 14, 15, 16];
      board = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, G],
        [9, A, B, C, 1, 2, 3, 4, D, E, F, G, 5, 6, 7, 8],
        [5, 6, 7, 8, D, E, F, G, 1, 2, 3, 4, 9, A, B, C],
        [D, E, F, G, 9, A, B, C, 5, 6, 7, 8, 1, 2, 3, 4],

        [3, 1, 4, 2, 7, 5, 8, 6, B, 9, E, A, F, C, G, D],
        [B, 9, E, A, 3, 1, 4, 2, F, C, G, D, 7, 5, 8, 6],
        [7, 5, 8, 6, F, C, G, D, 3, 1, 4, 2, B, 9, E, A],
        [F, C, G, D, B, 9, E, A, 7, 5, 8, 6, 3, 1, 4, 2],

        [2, 4, 1, 3, 6, 8, 5, 7, A, F, 9, B, C, G, D, E],
        [A, F, 9, B, 2, 4, 1, 3, C, G, D, E, 6, 8, 5, 7],
        [6, 8, 5, 7, C, G, D, E, 2, 4, 1, 3, A, F, 9, B],
        [C, G, D, E, A, F, 9, B, 6, 8, 5, 7, 2, 4, 1, 3],

        [4, 3, 2, 1, 8, 7, 6, 5, E, B, A, 9, G, D, C, F],
        [E, B, A, 9, 4, 3, 2, 1, G, D, C, F, 8, 7, 6, 5],
        [8, 7, 6, 5, G, D, C, F, 4, 3, 2, 1, E, B, A, 9],
        [G, D, C, F, E, B, A, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      ];
      break;
  }

  // Swap numbers
  let numbers = [...Array(boardSize).keys()].map((i) => i + 1);
  shuffleArray(numbers);

  for (line of board) {
    tempBoard.push(line.map((number) => numbers.indexOf(number) + 1));
  }

  // Shuffle lines within the subgrid-sized slices and the slices themselves
  board = [];
  sliceAndShuffle(tempBoard, board, boardSize, subSize);

  // Shuffle lines within the subgrid-sized slices and the slices themselves
  tempBoard = JSON.parse(JSON.stringify(invertMatrix(board, boardSize)));
  sliceAndShuffle(tempBoard, board, boardSize, subSize);
  board = JSON.parse(JSON.stringify(invertMatrix(tempBoard, boardSize)));

  // Rewrite the board in lines, columns and subGrids as arrays
  let [lines, columns, subGrids] = makeBoard(board, boardSize, subSize);

  // Remove numbers at random positions until the board is unsolvable, then go back one step
  let copy = JSON.parse(JSON.stringify(board));
  while (true) {
    // Randomly select a non-empty cell
    let rdmLine, rdmColumn;
    do {
      rdmLine = Math.floor(Math.random() * boardSize);
      rdmColumn = Math.floor(Math.random() * boardSize);
    } while (board[rdmLine][rdmColumn] === 0);

    // Set the value of the random cell to 0 (empty) but store the original value
    let value = board[rdmLine][rdmColumn];
    board[rdmLine][rdmColumn] = 0;

    // Check whether the puzzle is no longer solveable
    copy = JSON.parse(JSON.stringify(board));

    if (!solve(copy)) {
      board[rdmLine][rdmColumn] = value;
      break;
    }
  }

  return board;
}

// Transform numbers on the board from 10 to 16 into the corresponding letters A to G
function hexify(board) {
  let hexBoard = [];
  for (let arr of board) {
    let hexArr = arr.map((num) => {
      if (num >= 10) {
        return String.fromCharCode(num + 55);
      } else {
        return num;
      }
    });
    hexBoard.push(hexArr);
  }
  return hexBoard;
}

// Transform letters on the board from A to G into the corresponding numbers 10 to 16
function dehexify(board) {
  let dehexBoard = [];
  for (let arr of board) {
    let dehexArr = arr.map((char) => {
      if (/[A-G]/.test(char)) {
        return char.charCodeAt(0) - 55;
      } else {
        return parseInt(char);
      }
    });
    dehexBoard.push(dehexArr);
  }
  return dehexBoard;
}

// Shuffle the elements in an array of any size
function shuffleArray(arr) {
  let rdmIndex;

  // For each element in the array, swap its position with an element at a random position
  for (let i = 0; i < arr.length; i++) {
    rdmIndex = Math.floor(Math.random() * arr.length);
    [arr[i], arr[rdmIndex]] = [arr[rdmIndex], arr[i]];
  }

  return arr;
}

// Slice array into subgrid-sized slices and shuffle its elements, as well as the slices themselves
function sliceAndShuffle(inArray, outArray, boardSize, subSize) {
  let slices = [];

  for (let i = 0; i < boardSize; i += subSize) {
    let slice = inArray.slice(i, i + subSize);
    slices.push(slice);
  }

  shuffleArray(slices);

  for (let slice of slices) {
    shuffleArray(slice);
    outArray.push(...slice);
  }
}

// Solve a sudoku puzzle of any size by trying to fill each sub-grid, line and column, and analysing the candidates for each cell
function solve(puzzle) {
  // Make a copy of the board
  let board = JSON.parse(JSON.stringify(puzzle));

  // So it works for any sudoku board size
  const boardSize = board.length;
  const subSize = Math.sqrt(boardSize);

  let [lines, columns, subGrids] = makeBoard(board, boardSize, subSize);

  // Solve
  let filled;
  do {
    filled = 0;

    // Analyse candidates for each cell
    for (let i in board) {
      for (let j in board) {
        if (board[i][j] === 0) {
          let sub = getSub(i, j, subSize);
          let candidates = getCandidates(lines[i], columns[j], subGrids[sub], boardSize);
          if (candidates.length === 1) {
            board[i][j] = candidates.pop();
            updateBoard(board[i][j], i, j, sub, lines, columns, subGrids, subSize);
            filled++;
          }
        }
      }
    }

    // Try to fill each sub-grid
    for (let i in subGrids) {
      let numbersRemaining = [...Array(boardSize).keys()]
        .map((n) => n + 1)
        .filter((number) => !subGrids[i].includes(number));
      for (let number of numbersRemaining) {
        let possibleCellsIndexes = [];
        subGrids[i].forEach((num) => {
          if (num === 0) {
            let lastIndex = possibleCellsIndexes[possibleCellsIndexes.length - 1];
            possibleCellsIndexes.push(subGrids[i].indexOf(num, lastIndex + 1));
          }
        });
        let counter = 0;
        let line, column, rightLine, rightColumn;
        for (let j of possibleCellsIndexes) {
          line = Math.floor(i / subSize) * subSize + Math.floor(j / subSize);
          column = (i % subSize) * subSize + (j % subSize);
          if (!lines[line].includes(number) && !columns[column].includes(number)) {
            rightLine = line;
            rightColumn = column;
            counter++;
            if (counter == 2) {
              break;
            }
          }
        }
        if (counter == 1) {
          board[rightLine][rightColumn] = number;
          updateBoard(number, rightLine, rightColumn, i, lines, columns, subGrids, subSize);
          filled++;
        }
      }
    }

    // Try to fill each line
    for (let i in lines) {
      let numbersRemaining = [...Array(boardSize).keys()]
        .map((n) => n + 1)
        .filter((number) => !lines[i].includes(number));
      for (let number of numbersRemaining) {
        let possibleCellsIndexes = [];
        lines[i].forEach((num) => {
          if (num === 0) {
            let lastIndex = possibleCellsIndexes[possibleCellsIndexes.length - 1];
            possibleCellsIndexes.push(lines[i].indexOf(num, lastIndex + 1));
          }
        });
        let counter = 0;
        let sub, column, rightSub, rightColumn;
        for (let j of possibleCellsIndexes) {
          sub = getSub(i, j, subSize);
          column = j;
          if (!subGrids[sub].includes(number) && !columns[column].includes(number)) {
            rightSub = sub;
            rightColumn = column;
            counter++;
            if (counter == 2) {
              break;
            }
          }
        }
        if (counter == 1) {
          board[i][rightColumn] = number;
          updateBoard(number, i, rightColumn, rightSub, lines, columns, subGrids, subSize);
          filled++;
        }
      }
    }

    // Try to fill each column
    for (let i in columns) {
      let numbersRemaining = [...Array(boardSize).keys()]
        .map((n) => n + 1)
        .filter((number) => !columns[i].includes(number));
      for (let number of numbersRemaining) {
        let possibleCellsIndexes = [];
        columns[i].forEach((num) => {
          if (num === 0) {
            let lastIndex = possibleCellsIndexes[possibleCellsIndexes.length - 1];
            possibleCellsIndexes.push(columns[i].indexOf(num, lastIndex + 1));
          }
        });
        let counter = 0;
        let sub, line, rightSub, rightLine;
        for (let j of possibleCellsIndexes) {
          sub = getSub(j, i, subSize);
          line = j;
          if (!subGrids[sub].includes(number) && !lines[line].includes(number)) {
            rightSub = sub;
            rightLine = line;
            counter++;
            if (counter == 2) {
              break;
            }
          }
        }
        if (counter == 1) {
          board[rightLine][i] = number;
          updateBoard(number, rightLine, i, rightSub, lines, columns, subGrids, subSize);
          filled++;
        }
      }
    }
  } while (filled !== 0);

  // Retransform numbers from 10 to 16 to letters
  board = hexify(board);

  // Check whether there are still blank cells, in which case the puzzle is unsolvable by this method
  for (let arr of board) {
    if (arr.includes(0)) {
      return false;
    }
  }

  return board;
}

// Swap lines with columns, and vice-versa
function invertMatrix(inArray, size) {
  let outArray = [];
  for (let i = 0; i < size; i++) {
    let column = [];
    for (let line of inArray) {
      column.push(line[i]);
    }
    outArray.push(column);
  }
  return outArray;
}

// Rewrite the board as sub-grids
function getSubGrids(inArray, boardSize, subSize) {
  let outArray = [];
  for (let m = 0; m < boardSize; m += subSize) {
    for (let n = 0; n < boardSize; n += subSize) {
      let subGrid = [];
      for (let i = m; i < m + subSize; i++) {
        for (let j = n; j < n + subSize; j++) {
          subGrid.push(inArray[i][j]);
        }
      }
      outArray.push(subGrid);
    }
  }
  return outArray;
}

// Rewrite the board in lines, columns and subGrids as arrays
function makeBoard(board, boardSize, subSize) {
  // Declare arrays
  let lines = [];
  let columns = [];
  let subGrids = [];

  // Populate lines
  lines = [...board];

  //Populate columns
  columns = JSON.parse(JSON.stringify(invertMatrix(board, boardSize)));

  // Populate subGrids
  subGrids = JSON.parse(JSON.stringify(getSubGrids(board, boardSize, subSize)));

  return [lines, columns, subGrids];
}

// For a given cell position i, j, determine which sub-grid it belongs to
function getSub(i, j, subSize) {
  let Y = Math.floor(i / subSize);
  let X = Math.floor(j / subSize);
  return Y * subSize + X;
}

// For a given cell, determine all possible numbers at the moment
function getCandidates(line, column, subGrid, boardSize) {
  // Generate array with all possible numbers for this board size
  const allNumbers = [...Array(boardSize).keys()].map((n) => n + 1);

  // Filter out all numbers already included on either line, column or sub-grid
  let candidates = [...allNumbers]
    .filter((n) => !line.includes(n))
    .filter((n) => !column.includes(n))
    .filter((n) => !subGrid.includes(n));
  return candidates;
}

// Update the lines, columns and subGrids arrays corresponding to the changed cell
function updateBoard(number, line, column, subGrid, lines, columns, subGrids, subSize) {
  lines[line][column] = number;
  columns[column][line] = number;
  subGrids[subGrid][(line % subSize) * subSize + (column % subSize)] = number;
}

// Check whether a sudoku board is valid or not
function isValidSolution(board) {
  board = dehexify(board);
  boardSize = board.length;
  subSize = Math.sqrt(boardSize);

  // Get Rows
  let arrays = JSON.parse(JSON.stringify(board));

  // Get Columns
  for (let i = 0; i < boardSize; i++) {
    let column = [];
    for (let row of board) {
      column.push(row[i]);
    }
    arrays.push(column);
  }

  // Get Sub-grids
  for (let m = 0; m < boardSize; m += subSize) {
    for (let n = 0; n < boardSize; n += subSize) {
      let subGrid = [];
      for (let i = m; i < m + subSize; i++) {
        for (let j = n; j < n + subSize; j++) {
          subGrid.push(board[i][j]);
        }
      }
      arrays.push(subGrid);
    }
  }

  // Check for validity
  return arrays.every(
    (arr) =>
      JSON.stringify(arr.sort((a, b) => a - b)) ===
      JSON.stringify([...Array(boardSize).keys()].map((n) => n + 1))
  );
}
