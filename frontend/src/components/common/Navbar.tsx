import { Bell, Library, UserCircle2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Books",
    path: "/books",
  },
  {
    name: "Members",
    path: "/members",
  },
  {
    name: "Transactions",
    path: "/transactions",
  },
  {
    name: "Settings",
    path: "/settings",
  },
];

function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-8">

        <div className="flex items-center gap-12">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">

              <Library size={20} className="text-white"/>

            </div>

            <div>

              <h1 className="font-semibold text-slate-900">
                LibraX
              </h1>

            </div>

          </div>

          <nav className="flex gap-8">

            {links.map((link)=>(

              <NavLink
                key={link.name}
                to={link.path}
                className={({isActive})=>
                  isActive
                  ? "text-indigo-600 font-medium"
                  : "text-slate-500 hover:text-slate-900"
                }
              >
                {link.name}
              </NavLink>

            ))}

          </nav>

        </div>

        <div className="flex items-center gap-4">

<button
  onClick={() =>
    alert("No new notifications")
  }
  className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-slate-50"
>
            <Bell size={18}/>

          </button>

<button
  onClick={() => navigate("/settings")}
  className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition"
>
            <UserCircle2
              size={22}
              className="text-white"
            />

          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;