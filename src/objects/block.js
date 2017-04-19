function Block(row, col) {
  this.id = row.toString()+col.toString();
  // in what row is the block located
  this.row = row;

  // in what col is the block located
  this.col = col;
  // in what house is the block located
  this.value = null;
  this.possibleValues = ["1","2","3","4","5","6","7","8","9"];
  this.house = null;

  this.addToHouse = function(house) {
    this.house = house;
  };

  this.calcHouse = function() {
    if (this.row < 4) {
      if (this.col < 4) {
        return 1;
      }
      else if (this.col < 7) {
        return 2;
      }
      else {
        return 3;
      }
    }
    else if (this.row < 7) {
      if (this.col < 4) {
        return 4;
      }
      else if (this.col < 7) {
        return 5;
      }
      else {
        return 6;
      }
    }
    else {
      if (this.col < 4) {
        return 7;
      }
      else if (this.col < 7) {
        return 8;
      }
      else {
        return 9;
      }
    }
  };
}
