import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

interface Transaction {
  id: string;
  member: string;
  book: string;
  issueDate: string;
  dueDate: string;
  fine: string;
  status: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  status: "Available" | "Low Stock" | "Out of Stock";
}

interface Member {
  id: string;
  name: string;
  books: number;
}

const defaultTransactions: Transaction[] = [
  {
    id: "T001",
    member: "Rahul Sharma",
    book: "Clean Code",
    issueDate: "12 Jul 2026",
    dueDate: "26 Jul 2026",
    fine: "₹0",
    status: "Issued",
  },
  {
    id: "T002",
    member: "Priya Reddy",
    book: "Atomic Habits",
    issueDate: "08 Jul 2026",
    dueDate: "22 Jul 2026",
    fine: "₹0",
    status: "Returned",
  },
  {
    id: "T003",
    member: "Arjun Kumar",
    book: "Deep Work",
    issueDate: "28 Jun 2026",
    dueDate: "12 Jul 2026",
    fine: "₹150",
    status: "Overdue",
  },
  {
    id: "T004",
    member: "Sneha Patel",
    book: "Rich Dad Poor Dad",
    issueDate: "10 Jul 2026",
    dueDate: "24 Jul 2026",
    fine: "₹0",
    status: "Issued",
  },
  {
    id: "T005",
    member: "Ananya Rao",
    book: "The Pragmatic Programmer",
    issueDate: "01 Jul 2026",
    dueDate: "15 Jul 2026",
    fine: "₹80",
    status: "Overdue",
  },
];

function Transactions() {
  const location = useLocation();
  const [transactions, setTransactions] =
    useState<Transaction[]>(() => {
      const data =
        localStorage.getItem("transactions");

      return data
        ? JSON.parse(data)
        : defaultTransactions;
    });

  const [books, setBooks] =
    useState<Book[]>([]);

  const [members, setMembers] =
    useState<Member[]>([]);

  const [search, setSearch] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Transaction | null>(null);

  const [form, setForm] =
    useState<Transaction>({
      id: "",
      member: "",
      book: "",
      issueDate: "",
      dueDate: "",
      fine: "₹0",
      status: "Issued",
    });

    const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
  if (location.state?.openAddModal) {
    openAdd();

    window.history.replaceState({}, document.title);
  }
}, [location]);

  useEffect(() => {
    const storedBooks = JSON.parse(
      localStorage.getItem("books") || "[]"
    );

    const storedMembers = JSON.parse(
      localStorage.getItem("members") || "[]"
    );

    setBooks(storedBooks);
    setMembers(storedMembers);
  }, []);

  const filteredTransactions =
    transactions.filter(
      (transaction) =>
        transaction.member
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.book
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.id
          .toLowerCase()
          .includes(search.toLowerCase())
    );

  const openAdd = () => {
    setEditing(null);

    const lastId =
      transactions.length === 0
        ? 1
        : Math.max(
            ...transactions.map((t) =>
              Number(t.id.substring(1))
            )
          ) + 1;

    setForm({
      id: `T${String(lastId).padStart(
        3,
        "0"
      )}`,
      member: "",
      book: "",
      issueDate: "",
      dueDate: "",
      fine: "₹0",
      status: "Issued",
    });

    setOpen(true);
  };

  const openEdit = (
    transaction: Transaction
  ) => {
    setEditing(transaction);
    setForm(transaction);
    setOpen(true);
  };
  const saveTransaction = () => {
  setError("");

if (!form.member) {
  setError("Please select a member.");
  return;
}

if (!form.book) {
  setError("Please select a book.");
  return;
}

if (!form.issueDate) {
  setError("Issue date is required.");
  return;
}

if (!form.dueDate) {
  setError("Due date is required.");
  return;
}

if (new Date(form.dueDate) < new Date(form.issueDate)) {
  setError("Due date cannot be before issue date.");
  return;
}

  const updatedBooks = [...books];
  const updatedMembers = [...members];

  const bookIndex = updatedBooks.findIndex(
    (b) => b.title === form.book
  );

  const memberIndex = updatedMembers.findIndex(
    (m) => m.name === form.member
  );

  if (bookIndex === -1) {
    setError("Book not found.");
    return;
  }

  if (memberIndex === -1) {
    setError("Member not found.");
    return;
  }

  if (!editing) {
    if (
      form.status !== "Returned" &&
      updatedBooks[bookIndex].availableCopies <= 0
    ) {
      setError("No copies available.");
      return;
    }

    if (form.status !== "Returned") {
      updatedBooks[bookIndex].availableCopies--;
      updatedBooks[bookIndex].issuedCopies++;
      updatedMembers[memberIndex].books++;
    }
  } else {
    if (
      editing.status !== "Returned" &&
      form.status === "Returned"
    ) {
      updatedBooks[bookIndex].availableCopies++;
      updatedBooks[bookIndex].issuedCopies--;

      if (
        updatedMembers[memberIndex].books > 0
      ) {
        updatedMembers[memberIndex].books--;
      }
    }

    if (
      editing.status === "Returned" &&
      form.status !== "Returned"
    ) {
      if (
        updatedBooks[bookIndex].availableCopies <=
        0
      ) {
        setError("No copies available.");
        return;
      }

      updatedBooks[bookIndex].availableCopies--;
      updatedBooks[bookIndex].issuedCopies++;
      updatedMembers[memberIndex].books++;
    }
  }

  updatedBooks.forEach((book) => {
    if (book.availableCopies === 0)
      book.status = "Out of Stock";
    else if (book.availableCopies <= 5)
      book.status = "Low Stock";
    else
      book.status = "Available";
  });

  setBooks(updatedBooks);
  setMembers(updatedMembers);

  localStorage.setItem(
    "books",
    JSON.stringify(updatedBooks)
  );

  localStorage.setItem(
    "members",
    JSON.stringify(updatedMembers)
  );

  if (editing) {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === editing.id
          ? form
          : transaction
      )
    );
  } else {
    setTransactions([
      ...transactions,
      form,
    ]);
  }

  setOpen(false);
};

const deleteTransaction = (
  id: string
) => {
  const transaction = transactions.find(
    (t) => t.id === id
  );

  if (!transaction) return;

  if (
    !window.confirm(
      "Delete this transaction?"
    )
  )
    return;

  const updatedBooks = [...books];
  const updatedMembers = [...members];

  const bookIndex = updatedBooks.findIndex(
    (b) => b.title === transaction.book
  );

  const memberIndex =
    updatedMembers.findIndex(
      (m) => m.name === transaction.member
    );

  if (
    transaction.status !== "Returned" &&
    bookIndex !== -1
  ) {
    updatedBooks[bookIndex].availableCopies++;
    updatedBooks[bookIndex].issuedCopies--;

    if (
      updatedBooks[bookIndex].availableCopies ===
      0
    )
      updatedBooks[bookIndex].status =
        "Out of Stock";
    else if (
      updatedBooks[bookIndex]
        .availableCopies <= 5
    )
      updatedBooks[bookIndex].status =
        "Low Stock";
    else
      updatedBooks[bookIndex].status =
        "Available";
  }

  if (
    transaction.status !== "Returned" &&
    memberIndex !== -1 &&
    updatedMembers[memberIndex].books > 0
  ) {
    updatedMembers[memberIndex].books--;
  }

  setBooks(updatedBooks);
  setMembers(updatedMembers);

  localStorage.setItem(
    "books",
    JSON.stringify(updatedBooks)
  );

  localStorage.setItem(
    "members",
    JSON.stringify(updatedMembers)
  );

  setTransactions(
    transactions.filter(
      (transaction) =>
        transaction.id !== id
    )
  );
};
return (
  <div className="h-full flex flex-col gap-5">
    <PageHeader
      title="Transactions"
      subtitle="Issue & Return History"
      button={
        <Button onClick={openAdd}>
          <Plus size={17} />
          Issue Book
        </Button>
      }
    />

    <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <SearchBar
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        
      </div>

      <div className="mt-5 flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="h-12 border-b border-slate-200 text-left text-sm text-slate-500">
              <th>Member</th>
              <th>Book</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Fine</th>
              <th>Status</th>
              <th>ID</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="h-16 border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="font-medium">
                  {transaction.member}
                </td>

                <td>{transaction.book}</td>

                <td>{transaction.issueDate}</td>

                <td>{transaction.dueDate}</td>

                <td>{transaction.fine}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "Issued"
                        ? "bg-blue-100 text-blue-700"
                        : transaction.status === "Returned"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>

                <td>{transaction.id}</td>

                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() =>
                        openEdit(transaction)
                      }
                      className="w-9 h-9 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() =>
                        deleteTransaction(
                          transaction.id
                        )
                      }
                      className="w-9 h-9 rounded-lg hover:bg-red-100 text-red-600 flex items-center justify-center"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-5 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Total Transactions :
          <span className="font-semibold text-slate-800 ml-1">
            {filteredTransactions.length}
          </span>
        </p>
      </div>
    </div>

    <Modal
  isOpen={open}
  title={
    editing
      ? "Edit Transaction"
      : "Issue Book"
  }
  onClose={() => setOpen(false)}
>
  <div className="space-y-4">
    {error && (
  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
    {error}
  </div>
)}

    <Select
      label="Member"
      value={form.member}
      options={members.map((m) => m.name)}
      onChange={(e) =>
        setForm({
          ...form,
          member: e.target.value,
        })
      }
    />

    <Select
      label="Book"
      value={form.book}
      options={books
        .filter(
          (book) =>
            book.availableCopies > 0 ||
            book.title === form.book
        )
        .map((book) => book.title)}
      onChange={(e) =>
        setForm({
          ...form,
          book: e.target.value,
        })
      }
    />

    <Input
      label="Issue Date"
      type="date"
      value={form.issueDate}
      onChange={(e) =>
        setForm({
          ...form,
          issueDate: e.target.value,
        })
      }
    />

    <Input
      label="Due Date"
      type="date"
      value={form.dueDate}
      onChange={(e) =>
        setForm({
          ...form,
          dueDate: e.target.value,
        })
      }
    />

    <Input
      label="Fine"
      type="number"
      value={form.fine}
      onChange={(e) =>
        setForm({
          ...form,
          fine: e.target.value,
        })
      }
    />

    <div>
      <label className="block text-sm font-medium mb-2">
        Status
      </label>

      <select
        value={form.status}
        onChange={(e) =>
          setForm({
            ...form,
            status: e.target.value,
          })
        }
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
      >
        <option value="Issued">
          Issued
        </option>

        <option value="Returned">
          Returned
        </option>

        <option value="Overdue">
          Overdue
        </option>
      </select>
    </div>

    <div className="flex justify-end gap-3">
      <Button
        variant="secondary"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button onClick={saveTransaction}>
        {editing
          ? "Update Transaction"
          : "Issue Book"}
      </Button>
    </div>

  </div>
</Modal>
</div>
);
}

export default Transactions;