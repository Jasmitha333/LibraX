import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  ArrowRightLeft,
  Clock3,
  Plus,
  UserPlus,
  BookPlus,
  ChevronRight,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
}

interface Member {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  member: string;
  book: string;
  issueDate: string;
  dueDate: string;
  fine: string;
  status: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedBooks =
      JSON.parse(localStorage.getItem("books") || "[]");

    const storedMembers =
      JSON.parse(localStorage.getItem("members") || "[]");

    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions") || "[]");

    setBooks(storedBooks);
    setMembers(storedMembers);
    setTransactions(storedTransactions);
  }, []);

  const issued = transactions.filter(
    (t) => t.status === "Issued"
  ).length;

  const overdue = transactions.filter(
    (t) => t.status === "Overdue"
  ).length;

  const returned = transactions.filter(
    (t) => t.status === "Returned"
  ).length;

  const stats = [
    {
      title: "Books",
      value: books.length,
      change: "Available Books",
      icon: BookOpen,
    },
    {
      title: "Members",
      value: members.length,
      change: "Registered Members",
      icon: Users,
    },
    {
      title: "Issued",
      value: issued,
      change: "Currently Borrowed",
      icon: ArrowRightLeft,
    },
    {
      title: "Overdue",
      value: overdue,
      change: "Need Attention",
      icon: Clock3,
    },
  ];
    return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-slate-500">
            Library Workspace
          </p>

          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            Dashboard
          </h1>
        </div>

        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              onClick={() => {
              if (item.title === "Books") navigate("/books");
              if (item.title === "Members") navigate("/members");
              if (item.title === "Issued") navigate("/transactions");
              if (item.title === "Overdue") navigate("/transactions");
              }}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-2xl font-semibold mt-2">
                    {item.value}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {item.change}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon
                    size={18}
                    className="text-slate-700"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              Recent Transactions
            </h2>

            <button
  onClick={() => {
  console.log("clicked");
  navigate("/transactions");
}}
  className="text-sm text-indigo-600 flex items-center gap-1"
>
  View All
  <ChevronRight size={16} />
</button>
          </div>

          <div className="mt-4 space-y-3">
            {transactions
              .slice()
              .reverse()
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border rounded-xl p-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.member}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.book}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "Issued"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "Returned"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-8">
            <h2 className="font-semibold mb-4">
              Recently Added Books
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {books
                .slice()
                .reverse()
                .slice(0, 6)
                .map((book) => (
                  <div
                    key={book.id}
                    className="rounded-xl border bg-slate-50 p-4"
                  >
                    <BookOpen
                      size={18}
                      className="text-indigo-500"
                    />

                    <p className="mt-3 text-sm font-medium">
                      {book.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-lg">
            Quick Actions
          </h2>

          <div className="mt-5 space-y-3">
<button
  onClick={() =>
    navigate("/books", {
      state: {
        openAddModal: true,
      },
    })
  }
  className="w-full rounded-xl bg-slate-900 text-white py-3 flex justify-center items-center gap-2 hover:bg-slate-800"
>              <Plus size={18} />
              Add Book
            </button>

<button
  onClick={() =>
    navigate("/members", {
      state: {
        openAddModal: true,
      },
    })
  }
  className="w-full rounded-xl border py-3 flex justify-center items-center gap-2 hover:bg-slate-50"
>              <UserPlus size={18} />
              Add Member
            </button>

<button
  onClick={() =>
    navigate("/transactions", {
      state: {
        openAddModal: true,
      },
    })
  }
  className="w-full rounded-xl border py-3 flex justify-center items-center gap-2 hover:bg-slate-50"
>              <BookPlus size={18} />
              Issue Book
            </button>
          </div>

          <div className="mt-8 rounded-xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">
              Today's Summary
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Books</span>

                <span className="font-semibold">
                  {books.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Members</span>

                <span className="font-semibold">
                  {members.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Issued</span>

                <span className="font-semibold">
                  {issued}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Returned</span>

                <span className="font-semibold">
                  {returned}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Overdue</span>

                <span className="font-semibold text-red-600">
                  {overdue}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;