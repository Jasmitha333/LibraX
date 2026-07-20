#include "../include/Transaction.h"

Transaction::Transaction()
{
    id = "";
    memberName = "";
    bookTitle = "";
    issueDate = "";
    dueDate = "";
    fine = 0;
    status = "Issued";
}

Transaction::Transaction(
    string id,
    string memberName,
    string bookTitle,
    string issueDate,
    string dueDate,
    int fine,
    string status
)
{
    this->id = id;
    this->memberName = memberName;
    this->bookTitle = bookTitle;
    this->issueDate = issueDate;
    this->dueDate = dueDate;
    this->fine = fine;
    this->status = status;
}

string Transaction::getId() const
{
    return id;
}

string Transaction::getMemberName() const
{
    return memberName;
}

string Transaction::getBookTitle() const
{
    return bookTitle;
}

string Transaction::getIssueDate() const
{
    return issueDate;
}

string Transaction::getDueDate() const
{
    return dueDate;
}

int Transaction::getFine() const
{
    return fine;
}

string Transaction::getStatus() const
{
    return status;
}

void Transaction::setMemberName(string memberName)
{
    this->memberName = memberName;
}

void Transaction::setBookTitle(string bookTitle)
{
    this->bookTitle = bookTitle;
}

void Transaction::setIssueDate(string issueDate)
{
    this->issueDate = issueDate;
}

void Transaction::setDueDate(string dueDate)
{
    this->dueDate = dueDate;
}

void Transaction::setFine(int fine)
{
    this->fine = fine;
}

void Transaction::setStatus(string status)
{
    this->status = status;
}