let table_element = <HTMLTableElement>document.getElementById("table");
let colors = { "0": "#CDC0B4", "2": "#EEE4DA", "4": "#EDE0C8", "8": "#F2B179", "16": "#F59563", "32": "#F67C5F", "64": "#E95937", "128": "#F0D86C", "256": "#E5D040", "512": "#E9C02A", "1024": "#E2B913", "2048": "#CDC0B4", "4096": "#5FDB93", "8192": "#5FFB93", "16384": "#000000", }
let game_state = [[2, 2, 2, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 2, 2]]
function render() {
  table_element.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    let table_row = <HTMLTableRowElement>document.createElement("tr")
    for (let j = 0; j < 4; j++) {
      let table_data = <HTMLTableDataCellElement>document.createElement("td");
      let table_data_div = <HTMLDivElement>document.createElement("div");

      table_data_div.innerText = game_state[j][i] != 0 ? `${game_state[j][i]}` : "";
      table_data_div.style.backgroundColor = colors[game_state[j][i]];
      table_data.appendChild(table_data_div);
      table_row.appendChild(table_data);
    }
    table_element.appendChild(table_row);
  }
}

function rotate_matrix() {
  game_state = game_state[0].map((val, index) => game_state.map(row => row[index]).reverse())
}
function merge() {
  for (let y = 0; y < 4; y++) {
    for (let x_right = 3; x_right > 0; x_right--) {
      if (game_state[x_right][y] == 0) continue;
      let x_left = x_right - 1;
      while (0 < x_left && game_state[x_left][y] == 0) x_left--;
      if (game_state[x_left][y] == game_state[x_right][y]) {
        game_state[x_right][y] *= 2;
        game_state[x_left][y] = 0;
      }
    }
  }
}

function shift() {
  for (let y = 0; y < 4; y++) {
    for (let x_right = 3; x_right > 0; x_right--) {
      if (game_state[x_right][y] != 0) continue;
      let x_left = x_right - 1;
      while (0 < x_left && game_state[x_left][y] == 0) x_left--;
      if (game_state[x_left][y] != 0) {
        game_state[x_right][y] = game_state[x_left][y];
        game_state[x_left][y] = 0;
      }
    }
  }
}

let move: { [key: string]: { (): void } } = {
  "d": () => {
    merge();
    shift();
  },
  "a": () => {
    rotate_matrix();
    rotate_matrix();
    merge();
    shift();
    rotate_matrix();
    rotate_matrix();
  },
  "w": () => {
    rotate_matrix();
    rotate_matrix();
    rotate_matrix();
    merge();
    shift();
    rotate_matrix();
  },
  "s": () => {
    rotate_matrix();
    merge();
    shift();
    rotate_matrix();
    rotate_matrix();
    rotate_matrix();
  },
}
window.addEventListener("keypress", (event) => {
  move[event.key]();
  render();
})

// move.right()
render()