class Players {
  constructor() {
    this.players = {};
  }
  update({ id, position, size }) {
    this.players[id] = { position: position, size: size };
  }

  remove(id) {
    delete this.players[id];
  }

  draw() {
    if (Object.entries(this.players).length > 0) {
      for (const player of Object.keys(this.players)) {
        // console.log();
        ellipse(
          this.players[player].position.x,
          this.players[player].position.y,
          this.players[player].size
        );
      }
    }
  }
}
