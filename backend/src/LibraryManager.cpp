#include "../include/LibraryManager.h"

#include <algorithm>
#include <fstream>
#include <sstream>
#include <iostream>

LibraryManager::LibraryManager()
{
    if (!database.connect("../data/library.db"))
    {
        cout << "Database connection failed!" << endl;
        return;
    }

    database.execute(
        "CREATE TABLE IF NOT EXISTS books ("
        "id TEXT PRIMARY KEY,"
        "title TEXT NOT NULL,"
        "author TEXT NOT NULL,"
        "category TEXT NOT NULL,"
        "total_copies INTEGER NOT NULL,"
        "available_copies INTEGER NOT NULL,"
        "issued_copies INTEGER NOT NULL,"
        "status TEXT NOT NULL"
        ");"
    );

    database.execute(
        "CREATE TABLE IF NOT EXISTS members ("
        "id TEXT PRIMARY KEY,"
        "name TEXT NOT NULL,"
        "email TEXT NOT NULL,"
        "phone TEXT NOT NULL,"
        "books_borrowed INTEGER NOT NULL"
        ");"
    );

    database.execute(
        "CREATE TABLE IF NOT EXISTS transactions ("
        "id TEXT PRIMARY KEY,"
        "member_name TEXT NOT NULL,"
        "book_title TEXT NOT NULL,"
        "issue_date TEXT NOT NULL,"
        "due_date TEXT NOT NULL,"
        "fine INTEGER NOT NULL,"
        "status TEXT NOT NULL"
        ");"
    );
    loadBooks();
    loadMembers();

    cout << "SQLite database connected successfully!" << endl;
}

void LibraryManager::addBook(Book book)
{
    books.push_back(book);
    saveBooks();
}

vector<Book> LibraryManager::getBooks()
{
    return books;
}

Book* LibraryManager::searchBook(string id)
{
    auto it = find_if(
        books.begin(),
        books.end(),
        [&](Book &book)
        {
            return book.getId() == id;
        });

    if (it != books.end())
    {
        return &(*it);
    }

    return nullptr;
}

Book* LibraryManager::searchBookByTitle(string title)
{
    auto it = find_if(
        books.begin(),
        books.end(),
        [&](Book &book)
        {
            return book.getTitle() == title;
        });

    if (it != books.end())
    {
        return &(*it);
    }

    return nullptr;
}

void LibraryManager::updateBook(Book book)
{
    Book *existing = searchBook(book.getId());

    if (existing != nullptr)
    {
        *existing = book;
        saveBooks();
    }
}

void LibraryManager::deleteBook(string id)
{
    books.erase(
        remove_if(
            books.begin(),
            books.end(),
            [&](Book &book)
            {
                return book.getId() == id;
            }),
        books.end());

    saveBooks();
}

void LibraryManager::sortBooks()
{
    sort(
        books.begin(),
        books.end(),
        [](Book &a, Book &b)
        {
            return a.getTitle() < b.getTitle();
        });
}

void LibraryManager::addMember(Member member)
{
    members.push_back(member);
    saveMembers();
}

vector<Member> LibraryManager::getMembers()
{
    return members;
}

Member* LibraryManager::searchMember(string id)
{
    auto it = find_if(
        members.begin(),
        members.end(),
        [&](Member &member)
        {
            return member.getId() == id;
        });

    if (it != members.end())
    {
        return &(*it);
    }

    return nullptr;
}

Member* LibraryManager::searchMemberByName(string name)
{
    auto it = find_if(
        members.begin(),
        members.end(),
        [&](Member &member)
        {
            return member.getName() == name;
        });

    if (it != members.end())
    {
        return &(*it);
    }

    return nullptr;
}

void LibraryManager::updateMember(Member member)
{
    Member *existing = searchMember(member.getId());

    if (existing != nullptr)
    {
        *existing = member;
        saveMembers();
    }
}

void LibraryManager::deleteMember(string id)
{
    members.erase(
        remove_if(
            members.begin(),
            members.end(),
            [&](Member &member)
            {
                return member.getId() == id;
            }),
        members.end());

    saveMembers();
}

vector<Transaction> LibraryManager::getTransactions()
{
    return transactions;
}

void LibraryManager::issueBook(Transaction transaction)
{
    Book* book =
        searchBookByTitle(transaction.getBookTitle());

    Member* member =
        searchMemberByName(transaction.getMemberName());

    if (book == nullptr || member == nullptr)
    {
        return;
    }

    if (book->getAvailableCopies() <= 0)
    {
        return;
    }

    book->setAvailableCopies(
        book->getAvailableCopies() - 1);

    book->setIssuedCopies(
        book->getIssuedCopies() + 1);

    member->setBooksBorrowed(
        member->getBooksBorrowed() + 1);

    if (book->getAvailableCopies() == 0)
    {
        book->setStatus("Out of Stock");
    }
    else if (book->getAvailableCopies() <= 5)
    {
        book->setStatus("Low Stock");
    }
    else
    {
        book->setStatus("Available");
    }

    transactions.push_back(transaction);

    saveBooks();
    saveMembers();
    saveTransactions();
}

void LibraryManager::returnBook(string transactionId)
{
    auto it = find_if(
        transactions.begin(),
        transactions.end(),
        [&](Transaction &transaction)
        {
            return transaction.getId() == transactionId;
        });

    if (it == transactions.end())
    {
        return;
    }

    Book *book =
        searchBookByTitle(it->getBookTitle());

    Member *member =
        searchMemberByName(it->getMemberName());

    if (book == nullptr || member == nullptr)
    {
        return;
    }

    book->setAvailableCopies(
        book->getAvailableCopies() + 1);

    book->setIssuedCopies(
        book->getIssuedCopies() - 1);

    member->setBooksBorrowed(
        member->getBooksBorrowed() - 1);

    if (book->getAvailableCopies() == 0)
    {
        book->setStatus("Out of Stock");
    }
    else if (book->getAvailableCopies() <= 5)
    {
        book->setStatus("Low Stock");
    }
    else
    {
        book->setStatus("Available");
    }

    it->setStatus("Returned");

    saveBooks();
    saveMembers();
    saveTransactions();
}

void LibraryManager::saveBooks()
{
    database.execute("DELETE FROM books;");

    string sql =
        "INSERT INTO books "
        "(id, title, author, category, total_copies, available_copies, issued_copies, status) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

    sqlite3_stmt *statement = nullptr;

    if (sqlite3_prepare_v2(
            database.getConnection(),
            sql.c_str(),
            -1,
            &statement,
            nullptr) != SQLITE_OK)
    {
        return;
    }

    for (Book &book : books)
    {
        sqlite3_bind_text(statement, 1, book.getId().c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(statement, 2, book.getTitle().c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(statement, 3, book.getAuthor().c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(statement, 4, book.getCategory().c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int(statement, 5, book.getTotalCopies());
        sqlite3_bind_int(statement, 6, book.getAvailableCopies());
        sqlite3_bind_int(statement, 7, book.getIssuedCopies());
        sqlite3_bind_text(statement, 8, book.getStatus().c_str(), -1, SQLITE_TRANSIENT);

        sqlite3_step(statement);
        sqlite3_reset(statement);
    }

    sqlite3_finalize(statement);
}

void LibraryManager::loadBooks()
{
    books.clear();

    string sql =
        "SELECT id, title, author, category, total_copies, "
        "available_copies, issued_copies, status "
        "FROM books;";

    sqlite3_stmt *statement = nullptr;

    if (sqlite3_prepare_v2(
            database.getConnection(),
            sql.c_str(),
            -1,
            &statement,
            nullptr) != SQLITE_OK)
    {
        return;
    }

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        string id = reinterpret_cast<const char *>(sqlite3_column_text(statement, 0));
        string title = reinterpret_cast<const char *>(sqlite3_column_text(statement, 1));
        string author = reinterpret_cast<const char *>(sqlite3_column_text(statement, 2));
        string category = reinterpret_cast<const char *>(sqlite3_column_text(statement, 3));

        int totalCopies = sqlite3_column_int(statement, 4);
        int availableCopies = sqlite3_column_int(statement, 5);
        int issuedCopies = sqlite3_column_int(statement, 6);

        string status = reinterpret_cast<const char *>(sqlite3_column_text(statement, 7));

        Book book(
            id,
            title,
            author,
            category,
            totalCopies,
            availableCopies,
            issuedCopies,
            status);

        books.push_back(book);
    }

    sqlite3_finalize(statement);
}

void LibraryManager::saveMembers()
{
    database.execute("DELETE FROM members;");

    string sql =
        "INSERT INTO members "
        "(id, name, email, phone, books_borrowed) "
        "VALUES (?, ?, ?, ?, ?);";

    sqlite3_stmt *statement = nullptr;

    if (sqlite3_prepare_v2(
            database.getConnection(),
            sql.c_str(),
            -1,
            &statement,
            nullptr) != SQLITE_OK)
    {
        return;
    }

    for (Member &member : members)
    {
        sqlite3_bind_text(
            statement,
            1,
            member.getId().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            2,
            member.getName().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            3,
            member.getEmail().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            4,
            member.getPhone().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_int(
            statement,
            5,
            member.getBooksBorrowed());

        sqlite3_step(statement);
        sqlite3_reset(statement);
    }

    sqlite3_finalize(statement);
}

void LibraryManager::loadMembers()
{
    members.clear();

    string sql =
        "SELECT id, name, email, phone, books_borrowed "
        "FROM members;";

    sqlite3_stmt *statement = nullptr;

    if (sqlite3_prepare_v2(
            database.getConnection(),
            sql.c_str(),
            -1,
            &statement,
            nullptr) != SQLITE_OK)
    {
        return;
    }

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        string id =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 0));

        string name =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 1));

        string email =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 2));

        string phone =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 3));

        int booksBorrowed =
            sqlite3_column_int(statement, 4);

        Member member(
            id,
            name,
            email,
            phone,
            booksBorrowed);

        members.push_back(member);
    }

    sqlite3_finalize(statement);
}

void LibraryManager::saveTransactions()
{
    database.execute("DELETE FROM transactions;");

    string sql =
        "INSERT INTO transactions "
        "(id, member_name, book_title, issue_date, due_date, fine, status) "
        "VALUES (?, ?, ?, ?, ?, ?, ?);";

    sqlite3_stmt *statement = nullptr;

    if (sqlite3_prepare_v2(
            database.getConnection(),
            sql.c_str(),
            -1,
            &statement,
            nullptr) != SQLITE_OK)
    {
        return;
    }

    for (Transaction &transaction : transactions)
    {
        sqlite3_bind_text(
            statement,
            1,
            transaction.getId().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            2,
            transaction.getMemberName().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            3,
            transaction.getBookTitle().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            4,
            transaction.getIssueDate().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_text(
            statement,
            5,
            transaction.getDueDate().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_bind_int(
            statement,
            6,
            transaction.getFine());

        sqlite3_bind_text(
            statement,
            7,
            transaction.getStatus().c_str(),
            -1,
            SQLITE_TRANSIENT);

        sqlite3_step(statement);
        sqlite3_reset(statement);
    }

    sqlite3_finalize(statement);
}
void LibraryManager::loadTransactions()
{
    transactions.clear();

    string sql =
        "SELECT id, member_name, book_title, issue_date, "
        "due_date, fine, status "
        "FROM transactions;";

    sqlite3_stmt *statement = nullptr;

    if (sqlite3_prepare_v2(
            database.getConnection(),
            sql.c_str(),
            -1,
            &statement,
            nullptr) != SQLITE_OK)
    {
        return;
    }

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        string id =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 0));

        string memberName =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 1));

        string bookTitle =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 2));

        string issueDate =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 3));

        string dueDate =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 4));

        int fine =
            sqlite3_column_int(statement, 5);

        string status =
            reinterpret_cast<const char *>(
                sqlite3_column_text(statement, 6));

        Transaction transaction(
            id,
            memberName,
            bookTitle,
            issueDate,
            dueDate,
            fine,
            status);

        transactions.push_back(transaction);
    }

    sqlite3_finalize(statement);
}