#include "../include/Member.h"

Member::Member()
{
    id = "";
    name = "";
    email = "";
    phone = "";
    booksBorrowed = 0;
}

Member::Member(
    string id,
    string name,
    string email,
    string phone,
    int booksBorrowed
)
{
    this->id = id;
    this->name = name;
    this->email = email;
    this->phone = phone;
    this->booksBorrowed = booksBorrowed;
}

string Member::getId() const
{
    return id;
}

string Member::getName() const
{
    return name;
}

string Member::getEmail() const
{
    return email;
}

string Member::getPhone() const
{
    return phone;
}

int Member::getBooksBorrowed() const
{
    return booksBorrowed;
}

void Member::setName(string name)
{
    this->name = name;
}

void Member::setEmail(string email)
{
    this->email = email;
}

void Member::setPhone(string phone)
{
    this->phone = phone;
}

void Member::setBooksBorrowed(int booksBorrowed)
{
    this->booksBorrowed = booksBorrowed;
}