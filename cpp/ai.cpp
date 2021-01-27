#include <stdint.h>

#include <vector>

#include "Game.cpp"
using namespace std;
Game current_game;
Game* game_pool[4] = {};

uint32_t random_play(Game* game) {
  vector<uint32_t> whitelist;
  whitelist.push_back(0);
  whitelist.push_back(1);
  whitelist.push_back(2);
  whitelist.push_back(3);
  while (whitelist.size() > 0) {
    uint32_t choice = rand() % whitelist.size();
    if (
        (whitelist[choice] == 0 && !game->move_up()) ||
        (whitelist[choice] == 1 && !game->move_down()) ||
        (whitelist[choice] == 2 && !game->move_left()) ||
        (whitelist[choice] == 3 && !game->move_right()))
      whitelist.erase(whitelist.begin() + choice);
    else {
      whitelist.clear();
      whitelist.push_back(0);
      whitelist.push_back(1);
      whitelist.push_back(2);
      whitelist.push_back(3);
    }
  }
  return game->score();
}

void populate_pool() {
  Game* game_clone = current_game.clone();
  if (game_clone->move_up())
    game_pool[0] = game_clone;
  else {
    game_pool[0] = nullptr;
    delete game_clone;
  }
  game_clone = current_game.clone();
  if (game_clone->move_down())
    game_pool[1] = game_clone;
  else {
    game_pool[1] = nullptr;
    delete game_clone;
  }
  game_clone = current_game.clone();
  if (game_clone->move_left())
    game_pool[2] = game_clone;
  else {
    game_pool[2] = nullptr;
    delete game_clone;
  }
  game_clone = current_game.clone();
  if (game_clone->move_right())
    game_pool[0] = game_clone;
  else {
    game_pool[0] = nullptr;
    delete game_clone;
  }
}

uint32_t best_game() {
  uint32_t index = 0;
  uint32_t max = 0;
  for (uint32_t i = 0; i < 4; i++) {
    if (game_pool[i] != nullptr) {
      uint32_t score = game_pool[i]->score();
      if (score > max) {
        max = score;
        index = i;
      }
    }
  }
  return index;
}

bool max_by_tolerance(double tolerance) {
  uint32_t best_game_index = best_game();
  uint32_t max = game_pool[best_game_index]->score() * tolerance;
  if (max == 0) return false;
  for (int i = 0; i < 4; i++) {
    if (i != best_game_index && game_pool[i] != nullptr)
      if (max < game_pool[i]->score()) return false;
  }
  return true;
}
bool assert_lost() {
  for (int i = 0; i < 4; i++) {
    if (game_pool[i] != nullptr) return false;
  }
  return true;
}
int main() {
  uint32_t generation_count = 20;
  uint32_t default_pool[] = {0, 1, 2, 3};
  uint32_t scores[4] = {};
  while (1) {
    uint32_t score = current_game.score();
    generation_count = score;  //Math.log(score) * computation_scale;

    populate_pool();

    uint32_t max_score_game = game_pool[best_game()]->score();
    double tolerance = .97;
    if (assert_lost()) return 0;

    while (!max_by_tolerance(tolerance)) {
      for (int i = 0; i < 4; i++) {
        for (int j = 0; j < generation_count; j++) {
          if (game_pool[i] != nullptr) {
            Game* inner_game = game_pool[i]->clone();
            scores[i] += random_play(inner_game);
            delete inner_game;
          }
        }
      }
      tolerance += 0.001;
    }
    uint32_t best_move = best_game();
    max_score_game = game_pool[best_move]->score();
    if (best_move == 0) current_game.move_up();
    if (best_move == 1) current_game.move_down();
    if (best_move == 2) current_game.move_left();
    if (best_move == 3) current_game.move_right();
    //cout << best_move << endl;
    current_game.render();
  }
}