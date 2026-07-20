#include "../include/LibraryManager.h"

#include <algorithm>
#include <fstream>
#include <sstream>

LibraryManager::LibraryManager()
{
    loadBooks();
    loadMembers();
    loadTransactions();
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
    ofstream file("../data/books.txt");

    for (Book &book : books)
    {
        file
            << book.getId() << ","
            << book.getTitle() << ","
            << book.getAuthor() << ","
            << book.getCategory() << ","
            << book.getTotalCopies() << ","
            << book.getAvailableCopies() << ","
            << book.getIssuedCopies() << ","
            << book.getStatus()
            << endl;
    }

    file.close();
}

void LibraryManager::loadBooks()
{
    books.clear();

    ifstream file("../data/books.txt");

    if (!file.is_open())
    {
        return;
    }

    string line;

    while (getline(file, line))
    {
        stringstream ss(line);

        string id;
        string title;
        string author;
        string category;
        string totalCopies;
        string availableCopies;
        string issuedCopies;
        string status;

        getline(ss, id, ',');
        getline(ss, title, ',');
        getline(ss, author, ',');
        getline(ss, category, ',');
        getline(ss, totalCopies, ',');
        getline(ss, availableCopies, ',');
        getline(ss, issuedCopies, ',');
        getline(ss, status);

        Book book(
            id,
            title,
            author,
            category,
            stoi(totalCopies),
            stoi(availableCopies),
            stoi(issuedCopies),
            status);

        books.push_back(book);
    }

    file.close();
}

void LibraryManager::saveMembers()
{
    ofstream file("../data/members.txt");

    for (Member &member : members)
    {
        file
            << member.getId() << ","
            << member.getName() << ","
            << member.getEmail() << ","
            << member.getPhone() << ","
            << member.getBooksBorrowed()
            << endl;
    }

    file.close();
}

void LibraryManager::loadMembers()
{
    members.clear();

    ifstream file("../data/members.txt");

    if (!file.is_open())
    {
        return;
    }

    string line;

    while (getline(file, line))
    {
        stringstream ss(line);

        string id;
        string name;
        string email;
        string phone;
        string booksBorrowed;

        getline(ss, id, ',');
        getline(ss, name, ',');
        getline(ss, email, ',');
        getline(ss, phone, ',');
        getline(ss, booksBorrowed);

        Member member(
            id,
            name,
            email,
            phone,
            stoi(booksBorrowed));

        members.push_back(member);
    }

    file.close();
}

void LibraryManager::saveTransactions()
{
    ofstream file("../data/transactions.txt");

    for (Transaction &transaction : transactions)
    {
        file
            << transaction.getId() << ","
            << transaction.getMemberName() << ","
            << transaction.getBookTitle() << ","
            << transaction.getIssueDate() << ","
            << transaction.getDueDate() << ","
            << transaction.getFine() << ","
            << transaction.getStatus()
            << endl;
    }

    file.close();
}

void LibraryManager::loadTransactions()
{
    transactions.clear();

    ifstream file("../data/transactions.txt");

    if (!file.is_open())
    {
        return;
    }

    string line;

    while (getline(file, line))
    {
        stringstream ss(line);

        string id;
        string memberName;
        string bookTitle;
        string issueDate;
        string dueDate;
        string fine;
        string status;

        getline(ss, id, ',');
        getline(ss, memberName, ',');
        getline(ss, bookTitle, ',');
        getline(ss, issueDate, ',');
        getline(ss, dueDate, ',');
        getline(ss, fine, ',');
        getline(ss, status);

        Transaction transaction(
            id,
            memberName,
            bookTitle,
            issueDate,
            dueDate,
            stoi(fine),
            status);

        transactions.push_back(transaction);
    }

    file.close();
}

