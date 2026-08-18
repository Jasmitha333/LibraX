cmake_minimum_required(VERSION 3.10)

project(LibraryManagement)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)

find_package(SQLite3 REQUIRED)

add_executable(
    LibraryManagement

    src/main.cpp
    src/Book.cpp
    src/Member.cpp
    src/Transaction.cpp
    src/LibraryManager.cpp
    src/Database.cpp
)

target_link_libraries(
    LibraryManagement
    PRIVATE
    SQLite3::SQLite3
)