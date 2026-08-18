#ifndef DATABASE_H
#define DATABASE_H

#include <sqlite3.h>
#include <string>

using namespace std;

class Database
{
private:
    sqlite3 *db;

public:
    Database();
    ~Database();

    bool connect(string path);
    void disconnect();
    bool execute(string sql);
    sqlite3 *getConnection();
};

#endif