#ifndef BOOK_H
#define BOOK_H

#include <string>

using namespace std;

class Book
{
private:
    string id;
    string title;
    string author;
    string category;
    int totalCopies;
    int availableCopies;
    int issuedCopies;
    string status;

public:
    Book();

    Book(
        string id,
        string title,
        string author,
        string category,
        int totalCopies,
        int availableCopies,
        int issuedCopies,
        string status
    );

    string getId() const;
    string getTitle() const;
    string getAuthor() const;
    string getCategory() const;
    int getTotalCopies() const;
    int getAvailableCopies() const;
    int getIssuedCopies() const;
    string getStatus() const;

    void setTitle(string title);
    void setAuthor(string author);
    void setCategory(string category);
    void setTotalCopies(int totalCopies);
    void setAvailableCopies(int availableCopies);
    void setIssuedCopies(int issuedCopies);
    void setStatus(string status);
};

#endif