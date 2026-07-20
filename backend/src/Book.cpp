#include "../include/Book.h"

Book::Book()
{
    id = "";
    title = "";
    author = "";
    category = "";
    totalCopies = 0;
    availableCopies = 0;
    issuedCopies = 0;
    status = "Available";
}

Book::Book(
    string id,
    string title,
    string author,
    string category,
    int totalCopies,
    int availableCopies,
    int issuedCopies,
    string status
)
{
    this->id = id;
    this->title = title;
    this->author = author;
    this->category = category;
    this->totalCopies = totalCopies;
    this->availableCopies = availableCopies;
    this->issuedCopies = issuedCopies;
    this->status = status;
}

string Book::getId() const
{
    return id;
}

string Book::getTitle() const
{
    return title;
}

string Book::getAuthor() const
{
    return author;
}

string Book::getCategory() const
{
    return category;
}

int Book::getTotalCopies() const
{
    return totalCopies;
}

int Book::getAvailableCopies() const
{
    return availableCopies;
}

int Book::getIssuedCopies() const
{
    return issuedCopies;
}

string Book::getStatus() const
{
    return status;
}

void Book::setTitle(string title)
{
    this->title = title;
}

void Book::setAuthor(string author)
{
    this->author = author;
}

void Book::setCategory(string category)
{
    this->category = category;
}

void Book::setTotalCopies(int totalCopies)
{
    this->totalCopies = totalCopies;
}

void Book::setAvailableCopies(int availableCopies)
{
    this->availableCopies = availableCopies;
}

void Book::setIssuedCopies(int issuedCopies)
{
    this->issuedCopies = issuedCopies;
}

void Book::setStatus(string status)
{
    this->status = status;
}