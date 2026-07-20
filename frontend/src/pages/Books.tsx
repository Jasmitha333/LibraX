import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

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

const defaultBooks: Book[] = [
  {
    id: "B001",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    totalCopies: 12,
    availableCopies: 12,
    issuedCopies: 0,
    status: "Available",
  },
  {
    id: "B002",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    totalCopies: 5,
    availableCopies: 5,
    issuedCopies: 0,
    status: "Low Stock",
  },
  {
  id: "B003",
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt",
  category: "Programming",
  totalCopies: 0,
  availableCopies: 0,
  issuedCopies: 0,
  status: "Out of Stock",
  },
];

function Books() {
  const location = useLocation();
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : defaultBooks;
  });

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Programming");
  const [copies, setCopies] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
  if (location.state?.openAddModal) {
    setOpen(true);

    window.history.replaceState({}, document.title);
  }
}, [location]);

  function addBook() {
  setError("");

  const trimmedTitle = title.trim();
  const trimmedAuthor = author.trim();
  const totalCopies = Number(copies);

  if (!trimmedTitle) {
    setError("Book title is required.");
    return;
  }

  if (trimmedTitle.length < 2) {
    setError("Book title must contain at least 2 characters.");
    return;
  }

  if (!trimmedAuthor) {
    setError("Author name is required.");
    return;
  }

  if (!/^[A-Za-z.\s]+$/.test(trimmedAuthor)) {
    setError("Author name can contain only letters, spaces and dots.");
    return;
  }

  if (!copies.trim()) {
    setError("Please enter total copies.");
    return;
  }

  if (!Number.isInteger(totalCopies) || totalCopies < 0) {
    setError("Copies must be a whole number greater than or equal to 0.");
    return;
  }

  const duplicate = books.some(
    (book) =>
      book.title.toLowerCase() === trimmedTitle.toLowerCase() &&
      book.author.toLowerCase() === trimmedAuthor.toLowerCase()
  );

  if (duplicate) {
    setError("This book already exists.");
    return;
  }

  let status: Book["status"] = "Available";

  if (totalCopies === 0) {
    status = "Out of Stock";
  } else if (totalCopies <= 5) {
    status = "Low Stock";
  }

  const newBook: Book = {
    id: `B${String(books.length + 1).padStart(3, "0")}`,
    title: trimmedTitle,
    author: trimmedAuthor,
    category,
    totalCopies,
    availableCopies: totalCopies,
    issuedCopies: 0,
    status,
  };

  setBooks([...books, newBook]);

  setTitle("");
  setAuthor("");
  setCategory("Programming");
  setCopies("");
  setError("");
  setOpen(false);
}

  function deleteBook(id: string) {
    setBooks(books.filter((book) => book.id !== id));
  }

  const filteredBooks = useMemo(() => {
    const keyword = search.toLowerCase();

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword)
      );
    });
  }, [books, search]);

  return (
    <div className="h-full flex flex-col gap-5">

      <PageHeader
        title="Books"
        subtitle="Library Book Collection"
        button={
          <Button onClick={() => setOpen(true)}>
            <Plus size={17} />
            Add Book
          </Button>
        }
      />

      <Modal
        isOpen={open}
        title="Add Book"
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4">
          {error && (
  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
    {error}
  </div>
)}

          <Input
            label="Book Title"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Author"
            placeholder="Enter author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <Select
            label="Category"
            value={category}
            options={[
              "Programming",
              "Finance",
              "Science",
              "Self Help",
              "Productivity",
            ]}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            label="Total Copies"
            type="number"
            placeholder="0"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
          />

          <div className="flex justify-end gap-3">

            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={addBook}>
              Save Book
            </Button>

          </div>

        </div>
      </Modal>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">

        <div className="flex items-center justify-between mb-5">

          <SearchBar
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          

        </div>

        <div className="flex-1 overflow-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 text-left text-sm text-slate-500 h-12">

                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Status</th>
                <th>ID</th>
                <th></th>

              </tr>

            </thead>

            <tbody>

              {filteredBooks.map((book) => (
                                <tr
                  key={book.id}
                  className="h-16 border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-14 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        📘
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">
                          {book.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          Library Book
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-slate-600">
                    {book.author}
                  </td>

                  <td className="text-slate-600">
                    {book.category}
                  </td>

                  <td>
  <div className="flex flex-col">
    <span className="font-medium text-slate-700">
      {book.availableCopies} / {book.totalCopies}
    </span>

    <span className="text-xs text-slate-400">
      Issued: {book.issuedCopies}
    </span>
  </div>
</td>

                  <td>
                    <span
                      className={`inline-flex items-center justify-center min-w-[110px] h-7 rounded-full text-xs font-medium ${
                        book.status === "Available"
                          ? "bg-emerald-100 text-emerald-700"
                          : book.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>

                  <td className="text-slate-500">
                    {book.id}
                  </td>

                  <td>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-5 mt-5 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredBooks.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {books.length}
            </span>{" "}
            books
          </p>

          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg border border-slate-200 hover:bg-slate-50">
              Previous
            </button>

            <button className="w-9 h-9 rounded-lg bg-slate-900 text-white">
              1
            </button>

            <button className="h-9 px-4 rounded-lg border border-slate-200 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Books;