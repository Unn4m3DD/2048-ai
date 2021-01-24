import Game from "./Game.js";
let table_element = document.getElementById("table");
let colors = { "0": "#CDC0B4", "2": "#EEE4DA", "4": "#EDE0C8", "8": "#F2B179", "16": "#F59563", "32": "#F67C5F", "64": "#E95937", "128": "#F0D86C", "256": "#E5D040", "512": "#E9C02A", "1024": "#E2B913", "2048": "#CDC0B4", "4096": "#5FDB93", "8192": "#5FFB93", "16384": "#000000" };
let current_game = new Game();
function render() {
    table_element.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        let table_row = document.createElement("tr");
        for (let j = 0; j < 4; j++) {
            let table_data = document.createElement("td");
            let table_data_div = document.createElement("div");
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
});
function ai() {
    let default_pool = ["w", "a", "s", "d"];
    let current_pool = Array.from(default_pool);
    while (current_pool.length > 0) {
        let choice = Math.floor(Math.random() * current_pool.length);
        current_game.move[choice]();
    }
}
render();
//# sourceMappingURL=index.js.map