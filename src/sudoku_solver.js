var blocks = [];
var canvasSize = 900;
var blockSize = canvasSize / 9;
var houses = [];
var solverService = new SolverService();

function setup() {
  createCanvas(canvasSize + 1, canvasSize + 1);
  // create field of 9 rows of 9 cols
  for (var i = 1; i <= 9; i++) {
    houses.push(new House(i));
  }
  for (i = 1; i <= 9; i++) {
    for (var j = 1; j <= 9; j++) {
      var block = new Block(i, j);
      blocks.push(block);
      // add block to house.
      for (var k = 0; k < houses.length; k++) {
        if (block.calcHouse() === houses[k].id) {
          houses[k].addBlock(block);
          block.addToHouse(houses[k]);
        }
      }
    }
  }
}

function draw() {
  strokeWeight(3);
  line(blockSize * 3, 0, blockSize * 3, blockSize * 9);
  line(blockSize * 6, 0, blockSize * 6, blockSize * 9);
  line(0, blockSize * 3, blockSize * 9, blockSize * 3);
  line(0, blockSize * 6, blockSize * 9, blockSize * 6);


  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];

    fill('white');
    strokeWeight(1);
    rect(blockSize * block.col - (blockSize), blockSize * block.row - (blockSize), blockSize, blockSize);

    textAlign(CENTER);

    if (block.value !== null) {
      fill('blue');
      textSize(40);
      text(block.value, blockSize * (block.col - 1), blockSize * (block.row - 1) + (blockSize / 3), blockSize, blockSize);
    } else {
      fill('black');
      textSize(10);
      text(block.possibleValues.join(), blockSize * (block.col - 1), blockSize * (block.row - 1) + (blockSize / 3), blockSize, blockSize)
    }

  }
  strokeWeight(3);
  line(blockSize * 3, 0, blockSize * 3, blockSize * 9);
  line(blockSize * 6, 0, blockSize * 6, blockSize * 9);
  line(0, blockSize * 3, blockSize * 9, blockSize * 3);
  line(0, blockSize * 6, blockSize * 9, blockSize * 6);
}

function solvePuzzle() {
  // loop through all the blocks
  var something_solved = false;
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (block.value === null) {
      something_solved = solverService.findLastDigit(block);
      if (!something_solved) {
        something_solved = solverService.findHiddenSingle(block);
      }
      if (!something_solved) {
        something_solved = solverService.findPointing(block);
      }
      if (!something_solved) {
        something_solved = solverService.findClaiming(block);
      }
    }
  }
  return something_solved;

}

function mouseClicked() {
  var inputVal = window.prompt("Waarde", "");

  console.log(inputVal);
  var y = Math.ceil(mouseY / blockSize);
  var x = Math.ceil(mouseX / blockSize);

  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (block.row === y && block.col === x) {
      if (!isNaN(parseFloat(inputVal)) && isFinite(inputVal)) {
        block.value = inputVal;
        block.possibleValues = [block.value];
      }
    }
  }



  var solve = true;
  while (solve) {
    solve = solvePuzzle();
  }

}
