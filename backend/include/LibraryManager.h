#ifndef LIBRARYMANAGER_H
#define LIBRARYMANAGER_H

#include <vector>
#include <string>

#include "Book.h"
#include "Member.h"
#include "Transaction.h"

using namespace std;

class LibraryManager
{
private:
    vector<Book> books;
    vector<Member> members;
    vector<Transaction> transactions;

public:
    LibraryManager();

    void addBook(Book book);
    void updateBook(Book book);
    void deleteBook(string id);
    Book* searchBook(string id);
    Book* searchBookByTitle(string title);
    vector<Book> getBooks();
    void sortBooks();

    void addMember(Member member);
    void updateMember(Member member);
    void deleteMember(string id);
    Member* searchMember(string id);
    Member* searchMemberByName(string name);
    vector<Member> getMembers();

    void issueBook(Transaction transaction);
    void returnBook(string transactionId);
    vector<Transaction> getTransactions();

    void loadBooks();
    void saveBooks();

    void loadMembers();
    void saveMembers();

    void loadTransactions();
    void saveTransactions();
};

#endif