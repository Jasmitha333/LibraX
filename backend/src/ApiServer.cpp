#include "httplib.h"
#include "json.hpp"
#include "LibraryManager.h"

using namespace std;
using json = nlohmann::json;

int main()
{
    LibraryManager library;

    httplib::Server server;

    server.set_pre_routing_handler(
    [](const httplib::Request &req, httplib::Response &res)
    {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");

        if (req.method == "OPTIONS")
        {
            return httplib::Server::HandlerResponse::Handled;
        }

        return httplib::Server::HandlerResponse::Unhandled;
    });

    // GET all books
    server.Get("/api/books", [&](const httplib::Request &req,
                                 httplib::Response &res)
    {
        vector<Book> books = library.getBooks();

        json result = json::array();

        for (Book &book : books)
        {
            result.push_back({
                {"id", book.getId()},
                {"title", book.getTitle()},
                {"author", book.getAuthor()},
                {"category", book.getCategory()},
                {"totalCopies", book.getTotalCopies()},
                {"availableCopies", book.getAvailableCopies()},
                {"issuedCopies", book.getIssuedCopies()},
                {"status", book.getStatus()}
            });
        }

        res.set_content(
            result.dump(),
            "application/json"
        );
    });
    // POST - Add a new book
server.Post("/api/books", [&](const httplib::Request &req,
                              httplib::Response &res)
{
    try
    {
        json data = json::parse(req.body);

        Book book(
            data["id"],
            data["title"],
            data["author"],
            data["category"],
            data["totalCopies"],
            data["availableCopies"],
            data["issuedCopies"],
            data["status"]
        );

        library.addBook(book);

        res.status = 201;
        res.set_content(
            R"({"message":"Book added successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});
// PUT - Update an existing book
server.Put(R"(/api/books/(.+))", [&](const httplib::Request &req,
                                    httplib::Response &res)
{
    try
    {
        string id = req.matches[1];

        json data = json::parse(req.body);

        Book *book = library.searchBook(id);

        if (book == nullptr)
        {
            res.status = 404;
            res.set_content(
                R"({"error":"Book not found"})",
                "application/json"
            );
            return;
        }

        Book updatedBook(
            id,
            data["title"],
            data["author"],
            data["category"],
            data["totalCopies"],
            data["availableCopies"],
            data["issuedCopies"],
            data["status"]
        );

        library.updateBook(updatedBook);

        res.set_content(
            R"({"message":"Book updated successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});

// DELETE - Delete a book
server.Delete(R"(/api/books/(.+))", [&](const httplib::Request &req,
                                       httplib::Response &res)
{
    try
    {
        string id = req.matches[1];

        Book *book = library.searchBook(id);

        if (book == nullptr)
        {
            res.status = 404;
            res.set_content(
                R"({"error":"Book not found"})",
                "application/json"
            );
            return;
        }

        library.deleteBook(id);

        res.set_content(
            R"({"message":"Book deleted successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});
// GET - Get all members
server.Get("/api/members", [&](const httplib::Request &req,
                               httplib::Response &res)
{
    vector<Member> members = library.getMembers();

    json result = json::array();

    for (Member &member : members)
    {
        result.push_back({
            {"id", member.getId()},
            {"name", member.getName()},
            {"email", member.getEmail()},
            {"phone", member.getPhone()},
            {"booksBorrowed", member.getBooksBorrowed()}
        });
    }

    res.set_content(
        result.dump(),
        "application/json"
    );
});
// POST - Add a new member
server.Post("/api/members", [&](const httplib::Request &req,
                                httplib::Response &res)
{
    try
    {
        json data = json::parse(req.body);

        Member member(
            data["id"],
            data["name"],
            data["email"],
            data["phone"],
            data["booksBorrowed"]
        );

        library.addMember(member);

        res.status = 201;
        res.set_content(
            R"({"message":"Member added successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});


// PUT - Update a member
server.Put(R"(/api/members/(.+))",
    [&](const httplib::Request &req,
        httplib::Response &res)
{
    try
    {
        string id = req.matches[1];

        json data = json::parse(req.body);

        Member *member = library.searchMember(id);

        if (member == nullptr)
        {
            res.status = 404;
            res.set_content(
                R"({"error":"Member not found"})",
                "application/json"
            );
            return;
        }

        Member updatedMember(
            id,
            data["name"],
            data["email"],
            data["phone"],
            data["booksBorrowed"]
        );

        library.updateMember(updatedMember);

        res.set_content(
            R"({"message":"Member updated successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});


// DELETE - Delete a member
server.Delete(R"(/api/members/(.+))",
    [&](const httplib::Request &req,
        httplib::Response &res)
{
    try
    {
        string id = req.matches[1];

        Member *member = library.searchMember(id);

        if (member == nullptr)
        {
            res.status = 404;
            res.set_content(
                R"({"error":"Member not found"})",
                "application/json"
            );
            return;
        }

        library.deleteMember(id);

        res.set_content(
            R"({"message":"Member deleted successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});
// GET - Get all transactions
server.Get("/api/transactions",
    [&](const httplib::Request &req,
        httplib::Response &res)
{
    vector<Transaction> transactions =
        library.getTransactions();

    json result = json::array();

    for (Transaction &transaction : transactions)
    {
        result.push_back({
            {"id", transaction.getId()},
            {"memberName", transaction.getMemberName()},
            {"bookTitle", transaction.getBookTitle()},
            {"issueDate", transaction.getIssueDate()},
            {"dueDate", transaction.getDueDate()},
            {"fine", transaction.getFine()},
            {"status", transaction.getStatus()}
        });
    }

    res.set_content(
        result.dump(),
        "application/json"
    );
});


// POST - Issue a book / create transaction
server.Post("/api/transactions",
    [&](const httplib::Request &req,
        httplib::Response &res)
{
    try
    {
        json data = json::parse(req.body);

        Transaction transaction(
            data["id"],
            data["memberName"],
            data["bookTitle"],
            data["issueDate"],
            data["dueDate"],
            data["fine"],
            data["status"]
        );

        library.issueBook(transaction);

        res.status = 201;
        res.set_content(
            R"({"message":"Book issued successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});


// PUT - Return a book / update transaction status
server.Put(R"(/api/transactions/(.+))",
    [&](const httplib::Request &req,
        httplib::Response &res)
{
    try
    {
        string id = req.matches[1];

        library.returnBook(id);

        res.set_content(
            R"({"message":"Book returned successfully"})",
            "application/json"
        );
    }
    catch (const exception &e)
    {
        res.status = 400;

        json error = {
            {"error", e.what()}
        };

        res.set_content(
            error.dump(),
            "application/json"
        );
    }
});

// Serve React frontend
server.set_mount_point("/", "../../frontend/dist");
    cout << "LibraX API Server starting..." << endl;
    cout << "Server running at http://localhost:8080" << endl;

    server.listen("0.0.0.0", 8080);

    return 0;
}