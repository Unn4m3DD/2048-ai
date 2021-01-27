#include <stdint.h>

#include <vector>
#include <math.h>
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
  while (!whitelist.empty()) {
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

bool populate_pool() {
  bool result = false;
  game_pool[0] = current_game.clone();
  if (game_pool[0]->move_up()) {
    result = true;
  } else {
    delete game_pool[0];
    game_pool[0] = nullptr;
  }
  game_pool[1] = current_game.clone();
  if (game_pool[1]->move_down()) {
    result = true;
  } else {
    delete game_pool[1];
    game_pool[1] = nullptr;
  }
  game_pool[2] = current_game.clone();
  if (game_pool[2]->move_left()) {
    result = true;
  } else {
    delete game_pool[2];
    game_pool[2] = nullptr;
  }
  game_pool[3] = current_game.clone();
  if (game_pool[3]->move_right()) {
    result = true;
  } else {
    delete game_pool[3];
    game_pool[3] = nullptr;
  }
  return result;
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
typedef struct {
  uint32_t generation_count;
  uint32_t game_id;
  uint32_t* scores;
} generation_args_t;

void* generation(void* args) {
  generation_args_t* generation_args = (generation_args_t*)args;
  uint32_t generation_count = generation_args->generation_count;
  uint32_t game_id = generation_args->game_id;
  uint32_t* scores = generation_args->scores;
  for (int j = 0; j < generation_count; j++) {
    if (game_pool[game_id] != nullptr) {
      Game* inner_game = game_pool[game_id]->clone();
      scores[game_id] += random_play(inner_game);
      delete inner_game;
    }
  }
  return nullptr;
}

int main() {
  // while (1) {
  // current_game.render();
  // char opt;
  // cin >> opt;
  // cout << ((opt == 'w' && !current_game.move_up()) ||
  //  (opt == 's' && !current_game.move_down()) ||
  //  (opt == 'a' && !current_game.move_left()) ||
  //  (opt == 'd' && !current_game.move_right()))
  //  << endl;
  // }

  pthread_t generation_threads[4];
  uint32_t generation_count = 50;
  uint32_t default_pool[] = {0, 1, 2, 3};
  while (1) {
    uint32_t scores[4] = {0, 0, 0, 0};
    uint32_t score = current_game.score();
    generation_count = score;  //Math.log(score) * computation_scale;

    if (!populate_pool()) return 0;

    for (int i = 0; i < 4; i++)
      if (game_pool[i] != nullptr) {
        generation_args_t args;
        args.game_id = i;
        args.generation_count = generation_count;
        args.scores = scores;
        pthread_create(&generation_threads[i], nullptr, generation, &args);
      }

    for (int i = 0; i < 4; i++)
      if (game_pool[i] != nullptr)
        pthread_join(generation_threads[i], nullptr);

    uint32_t best_move = 0;
    for (int i = 0; i < 4; i++)
      if (scores[i] > scores[best_move]) best_move = i;
    current_game.render();
    if (best_move == 0) current_game.move_up();
    if (best_move == 1) current_game.move_down();
    if (best_move == 2) current_game.move_left();
    if (best_move == 3) current_game.move_right();

    for (int i = 0; i < 4; i++)
      if (game_pool[i] != nullptr) {
        delete game_pool[i];
        game_pool[i] = nullptr;
      }
    cout << best_move << endl;
  }
}