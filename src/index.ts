import Game from "./Game.js"
let table_element = <HTMLTableElement>document.getElementById("table");
let score_display_element = <HTMLHeadingElement>document.getElementById("score_display");
let ai_button_element = <HTMLButtonElement>document.getElementById("ai_button");
let computation_scale_element = <HTMLInputElement>document.getElementById("computation_scale");
let computation_scale_label_element = <HTMLSpanElement>document.getElementById("computation_scale_label");
let restart_button_element = <HTMLSpanElement>document.getElementById("restart_button");
let computation_scale = 2;
let ai_stop = false;
computation_scale_element.addEventListener("input", (event) => {
  computation_scale_label_element.innerText = "" + (<HTMLInputElement>event.target).value
  computation_scale = Number((<HTMLInputElement>event.target).value);
})
ai_button_element.addEventListener("click", (event) => { ai() })
restart_button_element.addEventListener("click", (event) => { current_game = new Game(); render(); ai_stop = true; })
let colors = { "0": "#CDC0B4", "2": "#EEE4DA", "4": "#EDE0C8", "8": "#F2B179", "16": "#F59563", "32": "#F67C5F", "64": "#E95937", "128": "#F0D86C", "256": "#E5D040", "512": "#E9C02A", "1024": "#E2B913", "2048": "#CDC0B4", "4096": "#5FDB93", "8192": "#5FFB93", "16384": "#000000" };
let current_game = new Game();
function render() {
  score_display_element.innerText = "Current Score: " + current_game.score();
  table_element.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    let table_row = <HTMLTableRowElement>document.createElement("tr")
    for (let j = 0; j < 4; j++) {
      let table_data = <HTMLTableDataCellElement>document.createElement("td");
      let table_data_div = <HTMLDivElement>document.createElement("div");
      table_data_div.classList.add("item")
      table_data_div.innerText = current_game.game_state[j][i] != 0 ? `${current_game.game_state[j][i]}` : "";
      table_data_div.style.backgroundColor = colors[current_game.game_state[j][i]];
      table_data.appendChild(table_data_div);
      table_row.appendChild(table_data);
    }
    table_element.appendChild(table_row);
  }
}

window.addEventListener("keypress", (event) => {
  current_game.move[event.key]();
  render();
})
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
async function ai() {
  await sleep(0)
  let generation_count = 20;
  let default_pool = ["w", "a", "s", "d"];
  let game_pool: { move: string, game: Game, score: number }[];
  function random_play(game: Game): number {
    let current_pool = Array.from(default_pool);
    while (current_pool.length > 0) {
      let choice = current_pool[Math.floor(Math.random() * current_pool.length)];
      if (!game.move[choice]())
        current_pool = current_pool.filter(e => e != choice)
      else
        current_pool = Array.from(default_pool);
    }
    return game.score();
  }
  function max_by_tolerance(array: { score: number }[], tolerance: number): boolean {
    let max = array.reduce((e1, e2) => e1.score > e2.score ? e1 : e2).score * tolerance;
    if (max == 0) return false;
    for (let i of array) {
      if (max < i.score) return false
    }
    return true;
  }
  while (1) {
    if (ai_stop) {
      ai_stop = false;
      return
    }
    let score = current_game.score();
    generation_count = Math.log(score) * computation_scale;
    game_pool = default_pool
      .map((item) => { return { move: item, game: current_game.clone(), score: 0 } })
      .filter((item) => item.game.move[item.move]())
    let max_score_game = game_pool.reduce((e1, e2) => e1.score > e2.score ? e1 : e2);
    let tolerance = .97;
    if (game_pool.length == 0) break;
    while (
      !max_by_tolerance(game_pool, tolerance)
    ) {
      for (let game of game_pool) {
        for (let i = 0; i < generation_count; i++) {
          game.score += random_play(game.game.clone());
        }
      }
      console.log(tolerance)
      tolerance += 0.001;
    }
    max_score_game = game_pool.reduce((e1, e2) => e1.score > e2.score ? e1 : e2);
    current_game.move[max_score_game.move]()
    render()
    await sleep(0)
  }
  render()
}
//ai()
render()