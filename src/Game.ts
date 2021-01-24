export default class Game {
  game_state = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  constructor() {
    this.generate_new_piece();
    this.generate_new_piece();
    this.generate_new_piece();
  }
  rotate_matrix() {
    this.game_state = this.game_state[0].map((val, index) => this.game_state.map(row => row[index]).reverse())
  }
  merge() {
    let result = false;
    for (let y = 0; y < 4; y++) {
      for (let x_right = 3; x_right > 0; x_right--) {
        if (this.game_state[x_right][y] == 0) continue;
        let x_left = x_right - 1;
        while (0 < x_left && this.game_state[x_left][y] == 0) x_left--;
        if (this.game_state[x_left][y] == this.game_state[x_right][y]) {
          this.game_state[x_right][y] *= 2;
          this.game_state[x_left][y] = 0;
          result = true;
        }
      }
    }
    return result;
  }
  shift() {
    console.log(this.game_state)
    let result = false;
    for (let y = 0; y < 4; y++) {
      for (let x_right = 3; x_right > 0; x_right--) {
        if (this.game_state[x_right][y] == 0) {
          let x_left = x_right - 1;
          while (0 < x_left && this.game_state[x_left][y] == 0) x_left--;
          if (this.game_state[x_left][y] != 0) {
            result = true;
            this.game_state[x_right][y] = this.game_state[x_left][y];
            this.game_state[x_left][y] = 0;
          }
        }
      }
    }
    console.log(this.game_state)
    return result;
  }

  generate_new_piece() {
    let available_positions = [];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        if (this.game_state[i][j] == 0) available_positions.push([i, j]);
    if (available_positions.length == 0) return false;
    let position = available_positions[Math.floor(Math.random() * available_positions.length)]
    this.game_state[position[0]][position[1]] = Math.random() < 0.9 ? 2 : 4;
  }

  move: { [key: string]: { (): boolean } } = {
    "d": () => {
      let r1 = this.merge();
      let r2 = this.shift();
      let result = r1 || r2;
      if (result)
        return this.generate_new_piece()
      return result;
    },
    "a": () => {
      this.rotate_matrix();
      this.rotate_matrix();
      let r1 = this.merge();
      let r2 = this.shift();
      let result = r1 || r2;
      this.rotate_matrix();
      this.rotate_matrix();
      if (result)
        return this.generate_new_piece()
      return result;
    },
    "w": () => {
      this.rotate_matrix();
      this.rotate_matrix();
      this.rotate_matrix();
      let r1 = this.merge();
      let r2 = this.shift();
      let result = r1 || r2;
      this.rotate_matrix();
      if (result)
        return this.generate_new_piece()
      return result;
    },
    "s": () => {
      this.rotate_matrix();
      let r1 = this.merge();
      let r2 = this.shift();
      let result = r1 || r2;
      this.rotate_matrix();
      this.rotate_matrix();
      this.rotate_matrix();
      if (result)
        return this.generate_new_piece()
      return result;
    },
  }
}