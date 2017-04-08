var blocks = [];
var canvasSize = 900;
var blockSize = canvasSize / 9;

function setup() {
  createCanvas(canvasSize + 1, canvasSize + 1);
  // create field of 9 rows of 9 cols
  for (var i = 1; i <= 9; i++) {
    for (var j = 1; j <= 9; j++) {
      blocks.push({
        'row': i,
        'col': j,
        'value': null
      });
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

    if (block.value !== null) {
      fill('blue');
      textSize(20);
      text(block.value, blockSize * block.col - (blockSize), blockSize * block.row - (blockSize), blockSize, blockSize);
    }

  }
  strokeWeight(3);
  line(blockSize * 3, 0, blockSize * 3, blockSize * 9);
  line(blockSize * 6, 0, blockSize * 6, blockSize * 9);
  line(0, blockSize * 3, blockSize * 9, blockSize * 3);
  line(0, blockSize * 6, blockSize * 9, blockSize * 6);
}

var findValueInNeighbors = function (block, value) {

  for (var j = 0; j < blocks.length; j++) {
    if (blocks[j].row === block.row && blocks[j].value === value.toString()) {
      return true;
    }
    if (blocks[j].col === block.col && blocks[j].value === value.toString()) {
      return true;
    }
    if (Math.floor((blocks[j].col-1)/3) === Math.floor((block.col-1)/3) && Math.floor((blocks[j].row-1)/3) === Math.floor((block.row-1)/3) && blocks[j].value === value.toString()) {
      return true;
    }
  }
  // check fields in the same area for this number.
  return false;
};
function solvePuzzle() {
  // loop through all the blocks
  var something_solved = false;
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (block.value === null) {
      // loop through numbers 1 to 9 and see if you can add this number based on algorithm
      var possible_numbers = [];
      for (var value=1; value<=9; value++) {
        // check fields in the same row for this number.
        var found = findValueInNeighbors(block, value);

        // if none were found this number is possible.
        if (found === false) {
          possible_numbers.push(value);
        }
      }

      if (possible_numbers.length === 1) {
        console.log('Solved with '+possible_numbers[0]+'!');
        console.log(block);
        block.value = possible_numbers[0].toString();
        something_solved = true;
      }
    }
  }
  return something_solved;

}

function mouseClicked() {
  var inputVal = window.prompt("Waarde", "1");

  if (!isNaN(inputVal)) {
    var y = Math.ceil(mouseY / blockSize);
    var x = Math.ceil(mouseX / blockSize);

    console.log(x);
    console.log(y);

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.row === y && block.col === x) {
        block.value = inputVal;
      }
    }
  }

  var solve = true;
  while (solve) {
    solve = solvePuzzle();
  }

}
