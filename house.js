function House(id) {
  this.id = id;
  this.blocks = [];

  this.addBlock = function(block) {
    this.blocks.push(block);
  }
}
