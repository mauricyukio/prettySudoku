# **prettySudoku**

## **Description**

It's sudoku, but prettier than ever. <br/>
This project was made as the final project for Harvard's CS50 course.

<br/>

## **Video Demo**

URL

<br/>

## **Usage**

No secrets here. This app is a static page hosted on [GitHub Pages](https://mauricyukio.github.io/prettySudoku/). Users may open the browser and play the game straightaway.

<br/>

## **Vision for the App, Acknoledgements and Important Decisions**

The initial idea for this app came from these two kata from [Code Wars](https://www.codewars.com/):

1. [Sudoku Solution Validator](https://www.codewars.com/kata/529bf0e9bdf7657179000008)
2. [Sudoku Solver](https://www.codewars.com/kata/5296bc77afba8baa690002d7)

After solving both, I figured I could expand on those two functions and build a full-fledged Sudoku-based application. Therefore, I started laying the vision for the application. The following were on the app's _user stories_ since its conception:

- **Themed Sudoku**: User can choose among several different themes and color schemes, but with a minimalist aesthetic. Heavily inspired by [Monkeytype](https://monkeytype.com/);

- **Easy and intuitive board navigation**: User can navigate through cells via mouse and keyboard, keyboard only and mouse / screen touch only;

- **Standard sudoku app visual aid**: User can easily see what cell they have selected at any moment, as well as all cells related to it (same row, same column, same box or same value), via color highlighting.

- **No standard sudoku app _highlight mistakes_ and _give hint_ functionality**: User cannot instantly check via cell colorization whether the number they just inputted is right for that cell or not, nor ask the app for "a hint", aka the app straight up filling a cell for them. From a game design perspective, I believe those functionalities detract from the experience and trivialize the game, so I opted to leave them out.

- **Multiple board sizes**: User can choose among three puzzle sizes (_2x2_, _3x3_ and _4x4_). When I found out _2x2_ and _4x4_ sudoku puzzles existed, I made a point to include them in the app.

Some things that have changed since the idea's conception were:

- The app was initially supposed to have at least two difficulty settings, one easy mode for casual / beginner players, and a hard mode for more advanced ones. The two ways I had thought of implementing it were either having the puzzle generator generate a random puzzle until it had more than a set number of empty cells for the user to fill for the hard mode, or implementing advanced sudoku techniques such as the XY-Wing in a separate `solveAdvanced()` to use in the generator function, thus also requiring the user to make use of those for their own solution. I ended up deciding against the difficulty setting option mainly for game design reasons. My vision was for the app to stand alone, just be what it is and provide a fair challenge for those seeking it. I wanted the puzzles to be solvable by pure simple logic only, without the need for prior knowledge of advanced techniques. This is the other side of the coin of not holding the player by the hand via "hints" or instantly highlighting mistakes. Generally speaking (and stretching quite a bit), the app should pretty much follow the design philosophy FromSoftware's [souls](https://en.wikipedia.org/wiki/Dark_Souls) games are widely known for: the challenge is there, immutable, to be overcome through effort and practice. Furthermore, the user already had the option to regulate difficulty by choosing the board size, with smaller boards meaning easier puzzles, so an additional layer of difficulty settings would be redundant, if not straight up confusing.
- Hex board

<br/>

## **Functions and App Creation History**

This web application started with the functions:

```
  solve() { receives an incomplete sudoku puzzle in array form and returns the completed version }
```

and

```
  isValidSolution() { checks whether a sudoku puzzle in array form is a valid solution or not }
```

which gave me the idea for building this in the first place, and are the basis for a sudoku application, along with the helper functions

```
  getCandidates() { for a given cell, returns an array with all candidates that can fill that cell }
```

```
  getSub() { returns the index of the sub-array / box a cell belongs to }
```

```
  makeBoard() { represents the board in terms of rows, columns and boxes }
```

and

```
  updateBoard() { updates the array so as to put the cells just filled in into consideration for the next iteration }
```

I had initially written the `solve()` function to only fill a cell if there was only one apt candidate to fill it, in a loop until all cells were filled. However, after I solved some sudoku puzzles manually, I realized I hardly ever use this method of solving, and in fact it often comes short in a handful of board states. Instead of listing candidates, I realized most of the time I filter out which numbers are still left to fill in a given row, column, or box, and try to fit those in, so I implemented those methods in code as well, interweaving them with the previous _count candidates_ method, and looping through all four methods until all the cells were filled.

The code for the helper functions

```
  getSubGrids() { rewrittes the board in terms of sub-grids, instead of rows and columns }
```

and

```
  invertMatrix() { inverts the rows of a matrix with its columns }
```

was initially written inside of the `makeBoard()` function. I separated them into their own functions later when I realized I would have to repeat those operations multiple times across the whole project.

With these basic functions down, I set out to write the function

```
  generatePuzzle() { generates a random solvable 4x4, 9x9 or 16x16 sudoku puzzle }
```

It was my idea since the start of the project for the application to be able to generate an infinite number of unique and random sudoku puzzles, and for the user to be able to choose the puzzle size out of _4x4_, _9x9_ and _16x16_. I wrote all previous functions with that in mind, so each one of them works for any puzzle size.

Regarding the `generatePuzzle()` function itself, my first attempt at implementing it was to start with a blank board (n arrays filled with 0s), and then start adding random numbers at random positions (although still checking if the numbers being added were valid candidates for their respective cells), until the function `solve()` could solve them. In short, keep adding random numbers until the puzzle is solvable. What I soon found out, however, is that this approach hardly ever works, due to unique nature of the constraints in sudoku puzzles. I later read that we can only estimate the number of unique minimal sudoku puzzles in existence through Statistics and Computer Science, which is very cool.

Since this approach did not work, I then figured I had to do the opposite, meaning start from a complete puzzle, then taking out one random number at a time until the puzzle was unsolvable by the function `solve()`, and then go back one step so that it was solvable again, and had only one possible solution. With that in mind, I looked for and hand-copied three solved sudoku puzzles, one of each puzzle size, assigning them to constants, so I could use them over and over in order to generate infinite puzzles.

The way this is done is by shuffling every number (for exemple, all _5s_ become _8s_, all _8s_ become _1s_, and so on), then shuffling every 2, 3, or 4 rows and columns, and then shuffling the 2, 3, or 4 row- or column-groups themselves. None of those changes affects the solvability status of the puzzle. After doing that the application proceeds to remove the numbers as described in the previous paragraph. In order to perform those tasks, the following helper functions were coded:

```
  shuffleArray() { pretty self-explanatorily takes any array and shuffles its values randomly }
```

```
  sliceAndShuffle() { slices the board into 2, 3, or 4 slices, depending on the size of the puzzle, then uses shuffleArray() to shuffle the slices among themselves, as well as the rows and columns within those slices }
```

Since this project was very array-oriented, I learnt a lot and became familiar with array methods such as `push()`, `map()`, `forEach()`, `filter()`, `every()`, `sort()`, `slice()`, `splice()`, `indexOf()` and `includes()`. I also learnt some neat tricks such as:

```
  let copy = JSON.parse(JSON.stringify(board));
```

to make a deep-copy of an array with all its sub-arrays,

```
  JSON.stringify(array1) === JSON.stringify(array2);
```

to deeply-compare two arrays considering all their sub-arrays,

```
  [...Array(boardSize).keys()].map(n => n + 1));
```

to create an array with all the numbers the user could use to fill in the cells,

```
  Array(n).fill(0);
```

to create an array filled with 0s. I was using that to generate the empty puzzle, but ended up going a different route for the aforementioned reasons.

After all the logic was done, it was time for me to create the UI for the application, via HTML and CSS, and the functions

```
  displayBoard() { displays a sudoku board on the HTML page }
```

and

```
  updatePage() { assign the new board elements to Javascript variables and adds event listeners to them }
```

That was very challenging and fun to code, because I had to consider the board, the boxes and the cells would have different sizes according to the size of the puzzle the user decided to work on. Also, since the initial conception of the idea for the sudoku application, I had the vision to allow the user to choose among multiple themes, via function

```
  setTheme() { sets the theme and color scheme for the page, per user choice via click }
```

so I had to work with variables in CSS, something I was not very used to, but ended up liking a lot. Many colors and sizes are dynamically generated via Javascript passing values to the CSS variables. The board is also generated via script, since it has variable size.

Along with the main `displayBoard()` function, the following functions were also coded during this time of development, in order to be able to deal with the 16x16 puzzle size:

```
  hexify() { transform numbers on the board from 10 to 16 into the corresponding letters A to G } and
```

```
  dehexify() { transform letters on the board from A to G into the corresponding numbers 10 to 16 }
```

This was a major decision I made when implementing this part of the code, because I had the option to go with the numbers 1 to 16 for the 16x16 sudoku, which arguably would have been easier, since I wouldn't then need to work with strings and conversions, and trying to compare strings to integers (which happened quite a few times). I decided on going for the 1-9 A-G route mainly for three reasons:

- It would be easier for the user to grasp the whole board by not filling it with a bunch of _1s_,
- It would be cleaner and look way better from a design perspective with all single digit characters instead of some single and some double.
- It would introduce and get the user familiar, even if unconsciously, with the hexadecimal number system, which may come in handy for them one day.

During this part of implementation I got more capable of working with DOM manipulation, adding and removing event listeners, appending and removing children, and setting attributes and properties via Javascript.

It was also part of the initial idea for the project for the user to be able to navigate on, fill, and erase cells on the board via keyboard and mouse, keyboard only, or mouse / screen touch only. With that in mind, a virtual numpad was created to allow for such functionalities with the functions

```
  displayNumpad() { displays said numpad on the HTML page, sized according to puzzle size }
```

```
  handleNumpadClick() { handles the event whenever the user clicks a button on the numpad }
```

```
  handleArrows() { handles keyboard arrow presses }
```

```
  handleKeyDown() { handles other keyboard key presses, such as numbers 1-9, letters A-G or a-g, and backspace }
```

and

```
  handleSelect() { handles direct clicks on cells }
```

That part introduced a lot of bugs on the UI, mainly for reasons of not successfully removing event listeners or removing them too early. That led me to gain a better understanding of this feature from Javascript. For example, I learnt the very important lesson that if one one plans to remove an event listener later on the code, one should not use an anonymous function, for even if the exact function lines are copied from the addEventListener method to the removeEventListener method, it is consider a whole new anonymous function that just so happens to do the exact same thing as the one in the addEventListener method. So, important lesson learned.

Next in line, some actions the user may perform would cause irreversible change to the board, and they would lose progress if not warned. So I created the functions

```
  showMessage() { shows message alerting the user about irreversible action and asking for confirmation }
```

and

```
  handleChoice() { handles user choosing one of the two options presented in the message }
```

`showMessage()` was by far the function that gave me the most trouble and headache, and I refactored it a lot of times. Some of its versions had nested switch events for the previous click on the _choose puzzle size_ option and the latter click on _choose whether to start anew or continue working on the current puzzle_ option, another had nested functions to pass arguments to the addEventListener callback function, and not only was that logic part complex to figure out, the message itself was troublesome to hide and show perfectly with CSS. The main mistake I ended up finding out I was making was that I was trying to add and remove event listeners to the choice buttons every time the function `showMessage()` was called, in other, words, every time the buttons appeared, I added the event listeners, and every time they disappeared, I removed them. That was causing many bugs involving event listeners not being removed properly, stacking on top of each other and firing the callback function multiple times. The simple solution was to only add the event listeners once, hide the buttons with CSS `display: none`, and program the event listeners so that they worked for any situation in which the function `showMessage()` was called.

One of the last functions to be coded was

```
  readBoard() { rewrite the board in the HTML element as a Javascript array }
```

to work in tandem with `isValidSolution()`, which was the first function that was written for this project. Those two functions are fired inside of the `showMessage()` function, for the case when the user clicks the "Check" button, and then the message tells the user whether he succeeded in solving the puzzle or not.

I spent a whole day working on the responsiveness of the design, which in itself was a big endeavor, for I had to account for the different possible board sizes, keeping in mind that I had to let the board be as big as possible, especially on smaller screens, while also showing the numpad, which was now more important than ever. I also had to come up with a way to hide all the theme buttons that were originally on the left side of the screen so that the board could occupy the screen's whole width. The solution was hiding the theme buttons and substituting them for a single button that, when clicked, fires the function

```
  changeTheme() { changes the page's theme to the next theme when using smaller screens }
```

Finally, there is the function

```
  start() { loads the page for the first time, along with the first puzzle }
```

that sets the app in motion, loading a random _9x9_ puzzle on the screen when the user first opens it.

<br/>

## **Final Thoughts**

Design-wise, this was the first project in which I worked with _svg_ and icons, both of which I will definitely keep using onwards. It was also a good opportunity to work with different color palettes and hover effects. I tried to go for the minimalist aesthetic, with a lot of emphasis on color.

Also, game-design-wise, since the conception of the project, I pretty early on made the decision not to instantly flag wrongly filled cells, or _"give a hint"_ for the player. I saw many online sudoku websites had these features, but the lack of them on this application is a feature and is intentional. That's because I believe painting the wrong number red straightaway trivializes the game, allowing the user to brute-force a cell he is having trouble with until the text becomes black, indicating that it's not wrong, or, even worse, giving the player _"a hint"_, _aka_ filling a cell for them, just takes the fun out of trying to solve a puzzle altogether. That is exactly the reason why there are multiple puzzle sizes available for the player to choose from, and no hard-coded difficulty button. The difficulty is the size of the puzzle itself and only that, and that is by design. Even solving a 4x4 sudoku puzzle can help an untrained player get familiar with the logic involved in the game, and that will allow them to progress towards bigger puzzles eventually.

This application is also not able to solve or generate puzzles that require advanced techniques such as the XY-Wing, and that is also by design, for that would render the puzzles too difficult for the average person to solve without some prior knowledge of such techniques, thus weakening my vision for the game, which is to generate an infinite number of unique puzzles that can be solved by pure simple logic only, without the need for advanced techniques, _"wrong number"_ warnings or _"hints"_. I reckon those techniques have their place among advanced sudoku players, but not here in this application.

<br/>

## **Contribute**

[Source Code](https://github.com/mauricyukio/prettySudoku)
