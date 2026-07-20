#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>

using namespace std;

class Transaction
{
private:
    string id;
    string memberName;
    string bookTitle;
    string issueDate;
    string dueDate;
    int fine;
    string status;

public:
    Transaction();

    Transaction(
    string id,
    string memberName,
    string bookTitle,
    string issueDate,
    string dueDate,
    int fine,
    string status
);

    string getId() const;
    string getMemberName() const;
    string getBookTitle() const;
    string getIssueDate() const;
    string getDueDate() const;
    int getFine() const;
    string getStatus() const;

    void setMemberName(string memberName);
    void setBookTitle(string bookTitle);
    void setIssueDate(string issueDate);
    void setDueDate(string dueDate);
    void setFine(int fine);
    void setStatus(string status);
};

#endif