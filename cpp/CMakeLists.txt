cmake_minimum_required (VERSION 2.8.11)
project (2048_ai)
add_executable (2048_ai 
  ai.cpp
)
target_link_libraries(2048_ai  
  -lpthread
)
