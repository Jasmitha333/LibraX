import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowRightLeft,
  Settings,
  Library,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { title: "Overview", icon: LayoutDashboard, path: "/" },
  { title: "Catalog", icon: BookOpen, path: "/books" },
  { title: "Members", icon: Users, path: "/members" },
  { title: "Transactions", icon: ArrowRightLeft, path: "/transactions" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-800 text-slate-200 flex flex-col border-r border-slate-700">

      <div className="px-8 py-8">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-indigo-500 flex items-center justify-center">

            <Library size={22} className="text-white" />

          </div>

          <div>

            <h1 className="text-xl font-semibold tracking-wide">
              Libra
            </h1>

            <p className="text-sm text-slate-400">
              Library Workspace
            </p>

          </div>

        </div>

      </div>

      <nav className="px-4 mt-6 space-y-2 flex-1">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive
                    ? "bg-slate-700 text-white border-l-4 border-indigo-400"
                    : "hover:bg-slate-700/60 text-slate-400"
                }`
              }
            >
              <Icon size={20} />

              {item.title}

            </NavLink>

          );

        })}

      </nav>

      <div className="p-6 border-t border-slate-700">

        <div className="rounded-2xl bg-slate-700 p-4">

          <p className="font-medium">
            Admin
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Library Administrator
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;