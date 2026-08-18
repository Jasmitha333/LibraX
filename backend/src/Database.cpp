#include "../include/Database.h"

Database::Database()
{
    db = nullptr;
}

Database::~Database()
{
    disconnect();
}

bool Database::connect(string path)
{
    if (sqlite3_open(path.c_str(), &db) == SQLITE_OK)
    {
        return true;
    }

    return false;
}

void Database::disconnect()
{
    if (db != nullptr)
    {
        sqlite3_close(db);
        db = nullptr;
    }
}

bool Database::execute(string sql)
{
    char *errorMessage = nullptr;

    int result = sqlite3_exec(
        db,
        sql.c_str(),
        nullptr,
        nullptr,
        &errorMessage
    );

    if (result != SQLITE_OK)
    {
        sqlite3_free(errorMessage);
        return false;
    }

    return true;
}

sqlite3 *Database::getConnection()
{
    return db;
}