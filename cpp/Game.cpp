#include <stdint.h>
#include <string.h>

#include <iostream>
#include <map>
#include <vector>
using namespace std;
class Point {
 public:
  uint32_t x, y;
  Point(const Point& point) : x(point.x), y(point.y) {}
  Point(uint32_t x, uint32_t y) : x(x), y(y) {}
  Point() : x(0), y(0) {}
};

class Game {
 public:
  uint32_t game_state[4][4];
  ;

  bool generate_new_piece() {
    vector<Point> available_positions = vector<Point>(16);
    for (uint32_t i = 0; i < 4; i++)
      for (uint32_t j = 0; j < 4; j++)
        if (game_state[i][j] == 0) available_positions.push_back(Point(i, j));
    if (available_positions.size() == 0) return false;
    Point* position = &available_positions[rand() % available_positions.size()];
    game_state[position->x][position->y] = (uint32_t)rand() % 10 < 9 ? 2 : 4;
    return true;
  }

  Game() {
    for (uint32_t y = 0; y < 4; y++) {
      for (uint32_t x = 0; x < 4; x++) {
        game_state[x][y] = 0;
      }
    }
    generate_new_piece();
    generate_new_piece();
    generate_new_piece();
  }

  void rotate_matrix() {
    for (int x = 0; x < 4 / 2; x++) {
      for (int y = x; y < 4 - x - 1; y++) {
        int temp = game_state[x][y];
        game_state[x][y] = game_state[y][4 - 1 - x];
        game_state[y][4 - 1 - x] = game_state[4 - 1 - x][4 - 1 - y];
        game_state[4 - 1 - x][4 - 1 - y] = game_state[4 - 1 - y][x];
        game_state[4 - 1 - y][x] = temp;
      }
    }
  }
  bool merge() {
    bool result = false;
    for (int32_t y = 0; y < 4; y++) {
      for (int32_t x_right = 3; x_right > 0; x_right--) {
        if (game_state[x_right][y] == 0) continue;
        int32_t x_left = x_right - 1;
        while (0 < x_left && game_state[x_left][y] == 0) x_left--;
        if (game_state[x_left][y] == game_state[x_right][y]) {
          game_state[x_right][y] *= 2;
          game_state[x_left][y] = 0;
          result = true;
        }
      }
    }
    return result;
  }
  bool shift() {
    bool result = false;
    for (int32_t y = 0; y < 4; y++)
      for (int32_t x_right = 3; x_right > 0; x_right--)
        if (game_state[x_right][y] == 0) {
          int32_t x_left = x_right - 1;
          while (0 < x_left && game_state[x_left][y] == 0) x_left--;
          if (game_state[x_left][y] != 0) {
            result = true;
            game_state[x_right][y] = game_state[x_left][y];
            game_state[x_left][y] = 0;
          }
        }
    return result;
  }

  bool move_right() {
    bool r1 = merge();
    bool r2 = shift();
    bool result = r1 || r2;
    if (result)
      return generate_new_piece();
    return result;
  }
  bool move_up() {
    rotate_matrix();
    rotate_matrix();
    rotate_matrix();
    bool r1 = merge();
    bool r2 = shift();
    bool result = r1 || r2;
    rotate_matrix();
    if (result)
      return generate_new_piece();
    return result;
  }
  bool move_left() {
    rotate_matrix();
    rotate_matrix();
    bool r1 = merge();
    bool r2 = shift();
    bool result = r1 || r2;
    rotate_matrix();
    rotate_matrix();
    if (result)
      return generate_new_piece();
    return result;
  }
  bool move_down() {
    rotate_matrix();
    bool r1 = merge();
    bool r2 = shift();
    bool result = r1 || r2;
    rotate_matrix();
    rotate_matrix();
    rotate_matrix();
    if (result)
      return generate_new_piece();
    return result;
  }

  uint32_t score() {
    uint32_t result = 0;
    for (uint32_t i = 0; i < 4; i++)
      for (uint32_t j = 0; j < 4; j++)
        result += game_state[i][j];
    return result;
  }

  Game* clone() {
    Game* result = new Game();
    memcpy(result->game_state, game_state, 4 * 4 * sizeof(uint32_t));
    return result;
  }

  void render() {
    printf("---------------------\n");
    printf("|%4d|%4d|%4d|%4d|\n", game_state[0][0], game_state[1][0], game_state[2][0], game_state[2][0]);
    printf("---------------------\n");
    printf("|%4d|%4d|%4d|%4d|\n", game_state[0][1], game_state[1][1], game_state[2][1], game_state[2][1]);
    printf("---------------------\n");
    printf("|%4d|%4d|%4d|%4d|\n", game_state[0][2], game_state[1][2], game_state[2][2], game_state[2][2]);
    printf("---------------------\n");
    printf("|%4d|%4d|%4d|%4d|\n", game_state[0][3], game_state[1][3], game_state[2][3], game_state[2][3]);
    printf("---------------------\n\n\n\n");
  }
};