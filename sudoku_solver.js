var blocks = [];
var canvasSize = 900;
var blockSize = canvasSize / 9;
var houses = [];

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

var findValueInNeighbors = function (block, value) {

  for (var j = 0; j < blocks.length; j++) {
    if (blocks[j].row === block.row && blocks[j].value === value.toString()) {
      return true;
    }
    if (blocks[j].col === block.col && blocks[j].value === value.toString()) {
      return true;
    }
    if (blocks[j].house.id === block.house.id && blocks[j].value === value.toString()) {
      return true;
    }
  }
  // check fields in the same area for this number.
  return false;
};

var findLastDigit = function (block) {
// loop through numbers 1 to 9 and see if you can add this number based on algorithm
  for (var j = 0; j < block.possibleValues.length; j++) {
    var value = block.possibleValues[j];
    // check fields in the same row for this number.
    var found = findValueInNeighbors(block, value);

    // if none were found this number is possible.
    if (found === true) {
      block.possibleValues.splice(j, 1);
    }
    if (block.possibleValues.length === 1) {
      var singlePossibleValue = block.possibleValues[0];
      console.log('Solved last digit with ' + singlePossibleValue + '!');
      console.log(block);
      block.value = singlePossibleValue;
      return true;
    }
  }
  return false;
};

/**
 * check if the number appears in one of the elements in the house as possible.
 * @param block
 * @returns {boolean}
 */
function findHiddenSingle(block) {
  // take one of the possible numbers.
  for (var j = 0; j < block.possibleValues.length; j++) {
    var number_possible_in_house = false;
    var value = block.possibleValues[j];

    for (var i = 0; i < block.house.blocks.length; i++) {
      var b = block.house.blocks[i];
      if (block.id !== b.id && b.possibleValues.indexOf(value) !== -1) {
        // if it does then the number cannot be used here for this
        number_possible_in_house = true;
        break;
      }
    }
    if (!number_possible_in_house) {
      // number was not found in the house so can be used for this field.
      console.log('Solved hidden single with ' + value + '!');
      console.log(block);
      block.value = value;
      return true;
    }
  }
  return false;


}
/**
 * If in a block all candidates of a certain digit are confined to a row or column, that digit cannot appear outside of that block in that row or column.
 *
 * @param block
 * @returns {boolean}
 */
function findPointing(block) {
  // get the possible numbers.
  var hasSolution = false;
  for (var j = 0; j < block.possibleValues.length; j++) {
    var value = block.possibleValues[j];

    var fields_in_house = block.house.blocks;

    var removeValue = false;

    var direction = null;
    for (var i = 0; i < fields_in_house.length; i++) {
      var field = fields_in_house[i];

      if (field.id !== block.id) {
        if (field.value === null && field.possibleValues.indexOf(value) !== -1) {
          if (field.row === block.row) {
            if (direction === 'col') {
              removeValue = false;
              break;
            }
            removeValue = true;
            direction = 'row';
          }
          else if (field.col === block.col) {
            if (direction === 'row') {
              removeValue = false;
              break;
            }
            removeValue = true;
            direction = 'col';
          }
          else {
            removeValue = false;
            break;
          }
        }

      }

    }
    // remove value from the blocks on the same row or col (based on direction) of the block.

    if (removeValue === true) {
      for (i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        // if we are checking the row and the row is the same but the house is different remove the value from the possible values
        if (direction === 'row' && b.row === block.row && b.house.id !== block.house.id && b.possibleValues.indexOf(value) !== -1) {
          // remove value from b
          b.possibleValues.splice(b.possibleValues.indexOf(value), 1);

          hasSolution = true;
        }
        if (direction === 'col' && b.col === block.col && b.house.id !== block.house.id && b.possibleValues.indexOf(value) !== -1) {
          // remove value from b
          b.possibleValues.splice(b.possibleValues.indexOf(value), 1);
          hasSolution = true;
        }
      }
      if (hasSolution) {
        console.log('Solved Locked Candidates Type 1 (Pointing) by removing ' + value + ' based on ' + block.id);
        console.log(block);
      }

    }
  }
  return hasSolution;

}
function findClaiming(block) {
  var hasSolution = false;
  for (var j = 0; j < block.possibleValues.length; j++) {
    var value = block.possibleValues[j];
    var rowLock = true;
    var colLock = true;
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (block.row === b.row && b.house.id !== block.house.id && b.possibleValues.indexOf(value) !== -1) {
        rowLock = false;
      }
      else if (block.col === b.col && b.house.id !== block.house.id && b.possibleValues.indexOf(value) !== -1) {
        colLock = false;
      }
    }

    for (i = 0; i < block.house.blocks.length; i++) {
      b = block.house.blocks[i];
      if (rowLock === true && b.row !== block.row && b.possibleValues.indexOf(value) !== -1) {
        console.log('rowlock on ' + b.id);
        b.possibleValues.splice(b.possibleValues.indexOf(value), 1);
        hasSolution = true;
      }
      if (colLock === true && b.col !== block.col && b.possibleValues.indexOf(value) !== -1) {
        console.log('collock on ' + b.id);
        b.possibleValues.splice(b.possibleValues.indexOf(value), 1);
        hasSolution = true;
      }
    }

    if (hasSolution) {
      console.log('Solved Locked Candidates Type 2 (Claiming) by removing ' + value + ' based on ' + block.id);
      console.log(block);
    }
  }
  return hasSolution;

}
function solvePuzzle() {
  // loop through all the blocks
  var something_solved = false;
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (block.value === null) {
      something_solved = findLastDigit(block);
      if (!something_solved) {
        something_solved = findHiddenSingle(block);
      }
      if (!something_solved) {
        something_solved = findPointing(block);
      }
      if (!something_solved) {
        something_solved = findClaiming(block);
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
