var table_element = document.getElementById("table");
var colors = { "0": "#CDC0B4", "2": "#EEE4DA", "4": "#EDE0C8", "8": "#F2B179", "16": "#F59563", "32": "#F67C5F", "64": "#E95937", "128": "#F0D86C", "256": "#E5D040", "512": "#E9C02A", "1024": "#E2B913", "2048": "#CDC0B4", "4096": "#5FDB93", "8192": "#5FFB93", "16384": "#000000" };
var game_state = [[2, 2, 2, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 2, 2]];
function render() {
    table_element.innerHTML = "";
    for (var i = 0; i < 4; i++) {
        var table_row = document.createElement("tr");
        for (var j = 0; j < 4; j++) {
            var table_data = document.createElement("td");
            var table_data_div = document.createElement("div");
            table_data_div.innerText = game_state[j][i] != 0 ? "" + game_state[j][i] : "";
            table_data_div.style.backgroundColor = colors[game_state[j][i]];
            table_data.appendChild(table_data_div);
            table_row.appendChild(table_data);
        }
        table_element.appendChild(table_row);
    }
}
function rotate_matrix() {
    game_state = game_state[0].map(function (val, index) { return game_state.map(function (row) { return row[index]; }).reverse(); });
}
function merge() {
    for (var y = 0; y < 4; y++) {
        for (var x_right = 3; x_right > 0; x_right--) {
            if (game_state[x_right][y] == 0)
                continue;
            var x_left = x_right - 1;
            while (0 < x_left && game_state[x_left][y] == 0)
                x_left--;
            if (game_state[x_left][y] == game_state[x_right][y]) {
                game_state[x_right][y] *= 2;
                game_state[x_left][y] = 0;
            }
        }
    }
}
function shift() {
    for (var y = 0; y < 4; y++) {
        for (var x_right = 3; x_right > 0; x_right--) {
            if (game_state[x_right][y] != 0)
                continue;
            var x_left = x_right - 1;
            while (0 < x_left && game_state[x_left][y] == 0)
                x_left--;
            if (game_state[x_left][y] != 0) {
                game_state[x_right][y] = game_state[x_left][y];
                game_state[x_left][y] = 0;
            }
        }
    }
}
var move = {
    "d": function () {
        merge();
        shift();
    },
    "a": function () {
        rotate_matrix();
        rotate_matrix();
        merge();
        shift();
        rotate_matrix();
        rotate_matrix();
    },
    "w": function () {
        rotate_matrix();
        rotate_matrix();
        rotate_matrix();
        merge();
        shift();
        rotate_matrix();
    },
    "s": function () {
        rotate_matrix();
        merge();
        shift();
        rotate_matrix();
        rotate_matrix();
        rotate_matrix();
    }
};
window.addEventListener("keypress", function (event) {
    move[event.key]();
    render();
});
// move.right()
render();
