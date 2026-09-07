cmake_minimum_required(VERSION 3.10)

project(LibraryManagement)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

# Existing console backend
add_executable(
    LibraryManagement

    src/main.cpp
    src/Book.cpp
    src/Member.cpp
    src/Transaction.cpp
    src/LibraryManager.cpp
    src/Database.cpp
)

# REST API server
add_executable(
    LibraXApi

    src/ApiServer.cpp
    src/Book.cpp
    src/Member.cpp
    src/Transaction.cpp
    src/LibraryManager.cpp
    src/Database.cpp
)

# SQLite
find_package(SQLite3 REQUIRED)

target_link_libraries(LibraryManagement
    SQLite::SQLite3
)

target_link_libraries(LibraXApi
    SQLite::SQLite3

)