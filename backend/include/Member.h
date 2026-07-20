#ifndef MEMBER_H
#define MEMBER_H

#include <string>

using namespace std;

class Member
{
private:
    string id;
    string name;
    string email;
    string phone;
    int booksBorrowed;

public:
    Member();

    Member(
        string id,
        string name,
        string email,
        string phone,
        int booksBorrowed
    );

    string getId() const;
    string getName() const;
    string getEmail() const;
    string getPhone() const;
    int getBooksBorrowed() const;

    void setName(string name);
    void setEmail(string email);
    void setPhone(string phone);
    void setBooksBorrowed(int booksBorrowed);
};

#endif