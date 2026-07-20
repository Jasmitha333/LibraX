import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  books: number;
  status: string;
}

const defaultMembers: Member[] = [
  {
    id: "M001",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    books: 2,
    status: "Active",
  },
  {
    id: "M002",
    name: "Priya Reddy",
    email: "priya@gmail.com",
    phone: "+91 9988776655",
    books: 1,
    status: "Active",
  },
  {
    id: "M003",
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    phone: "+91 9123456789",
    books: 4,
    status: "Inactive",
  },
  {
    id: "M004",
    name: "Arjun Kumar",
    email: "arjun@gmail.com",
    phone: "+91 9345678912",
    books: 0,
    status: "Active",
  },
  {
    id: "M005",
    name: "Ananya Rao",
    email: "ananya@gmail.com",
    phone: "+91 9012345678",
    books: 3,
    status: "Active",
  },
];

function Members() {
  const location = useLocation();
  const [members, setMembers] = useState<Member[]>(() => {
  const data = localStorage.getItem("members");
  return data ? JSON.parse(data) : defaultMembers;
  });
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState<Member | null>(null);

  const [form, setForm] = useState<Member>({
    id: "",
    name: "",
    email: "",
    phone: "",
    books: 0,
    status: "Active",
  });

  const [error, setError] = useState("");

  useEffect(() => {
  localStorage.setItem(
    "members",
    JSON.stringify(members)
  );
}, [members]);

useEffect(() => {
  if (location.state?.openAddModal) {
    openAdd();

    window.history.replaceState({}, document.title);
  }
}, [location]);

  

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    member.id.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);

    setForm({
      id: `M${String(members.length + 1).padStart(3, "0")}`,
      name: "",
      email: "",
      phone: "",
      books: 0,
      status: "Active",
    });

    setOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditing(member);
    setForm(member);
    setOpen(true);
  };

  const saveMember = () => {
  setError("");

  const name = form.name.trim();
  const email = form.email.trim().toLowerCase();
  const phone = form.phone.trim();

  if (!name) {
    setError("Member name is required.");
    return;
  }

  if (!/^[A-Za-z ]+$/.test(name)) {
    setError("Name can contain only letters and spaces.");
    return;
  }

  if (!email) {
    setError("Email is required.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!phone) {
    setError("Phone number is required.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    setError("Phone number must contain exactly 10 digits.");
    return;
  }

  const duplicateEmail = members.some(
    (m) =>
      m.email.toLowerCase() === email &&
      m.id !== form.id
  );

  if (duplicateEmail) {
    setError("Email already exists.");
    return;
  }

  const duplicatePhone = members.some(
    (m) =>
      m.phone === phone &&
      m.id !== form.id
  );

  if (duplicatePhone) {
    setError("Phone number already exists.");
    return;
  }

  const updatedMember = {
    ...form,
    name,
    email,
    phone,
  };

  if (editing) {
    setMembers(
      members.map((m) =>
        m.id === editing.id ? updatedMember : m
      )
    );
  } else {
    setMembers([...members, updatedMember]);
  }

  setError("");
  setOpen(false);
};

  const deleteMember = (id: string) => {
    if (
      !window.confirm(
        "Delete this member?"
      )
    )
      return;

    setMembers(
      members.filter((m) => m.id !== id)
    );
  };
    return (
    <div className="h-full flex flex-col gap-5">
      <PageHeader
        title="Members"
        subtitle="Library Members"
        button={
          <Button onClick={openAdd}>
            <Plus size={17} />
            Register Member
          </Button>
        }
      />

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <SearchBar
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          
        </div>

        <div className="mt-5 flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="h-12 border-b border-slate-200 text-left text-sm text-slate-500">
                <th>Member</th>
                <th>Phone</th>
                <th>Borrowed</th>
                <th>Status</th>
                <th>ID</th>
                <th className="w-28 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="h-16 border-b border-slate-100 hover:bg-slate-50"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} />

                      <div>
                        <p className="font-medium">{member.name}</p>

                        <p className="text-xs text-slate-500">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>{member.phone}</td>

                  <td>{member.books}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td>{member.id}</td>

                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(member)}
                        className="w-9 h-9 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteMember(member.id)}
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

        <div className="pt-5 border-t border-slate-200 flex justify-between">
          <p className="text-sm text-slate-500">
            Total Members :
            <span className="font-semibold text-slate-800 ml-1">
              {filteredMembers.length}
            </span>
          </p>
        </div>
      </div>

      <Modal
  isOpen={open}
  title={editing ? "Edit Member" : "Register Member"}
  onClose={() => setOpen(false)}
>
  <div className="space-y-4">
    {error && (
  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
    {error}
  </div>
)}
    <Input
      label="Member Name"
      value={form.name}
      onChange={(e) =>
        setForm({
          ...form,
          name: e.target.value,
        })
      }
    />

    <Input
      label="Email"
      value={form.email}
      onChange={(e) =>
        setForm({
          ...form,
          email: e.target.value,
        })
      }
    />

    <Input
      label="Phone"
      value={form.phone}
      onChange={(e) =>
        setForm({
          ...form,
          phone: e.target.value,
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
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div className="flex justify-end gap-3 pt-2">
      <Button
        variant="secondary"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button onClick={saveMember}>
        {editing ? "Update Member" : "Add Member"}
      </Button>
    </div>
  </div>
</Modal>
    </div>
  );
}

export default Members;