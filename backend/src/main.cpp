#include "../include/LibraryManager.h"

#include <iostream>

using namespace std;

int main()
{
    LibraryManager library;

    Book book1(
        "B001",
        "Clean Code",
        "Robert Martin",
        "Programming",
        10,
        10,
        0,
        "Available");

    Member member1(
        "M001",
        "Madhu",
        "madhu@gmail.com",
        "9876543210",
        0);

    library.addBook(book1);
    library.addMember(member1);

    Transaction transaction(
        "T001",
        "Madhu",
        "Clean Code",
        "20-07-2026",
        "27-07-2026",
        0,
        "Issued");

    library.issueBook(transaction);

    library.returnBook("T001");

    cout << "Library Management System Backend Working Successfully!"
         << endl;

    return 0;
}