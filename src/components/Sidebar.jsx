import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  User,
  FileText,
  StickyNote,
  FolderOpen,
  Search,
  Settings,
  LogOut,
  X,
  Sparkles,
  ChevronUp,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Schedule",
    path: "/schedule",
    icon: CalendarDays,
  },
  {
    name: "Reminders",
    path: "/reminders",
    icon: Bell,
  },
  {
    name: "Notes",
    path: "/notes",
    icon: StickyNote,
  },
  {
    name: "Files",
    path: "/files",
    icon: FolderOpen,
  },
  {
    name: "Search",
    path: "/search",
    icon: Search,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    name: "My CV",
    path: "/cv",
    icon: FileText,
  },
];

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const displayName =
    user?.user_metadata?.full_name || "Srisanth";

  const initial =
    displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  const linkClass = ({ isActive }) =>
    [
      "group flex items-center gap-3 rounded-[15px] px-3.5 py-3",
      "text-[13px] font-semibold transition-all duration-200",
      isActive
        ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-sm"
        : "text-slate-600 hover:bg-white/70 hover:text-indigo-700",
    ].join(" ");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={[
          "fixed left-4 top-4 bottom-4 z-50",
          "flex w-[276px] flex-col overflow-hidden",
          "rounded-[30px]",
          "border border-white/80",
          "bg-white/72",
          "shadow-[0_25px_70px_rgba(79,70,229,0.12)]",
          "backdrop-blur-2xl",
          "transition-transform duration-300",
          isOpen
            ? "translate-x-0"
            : "-translate-x-[120%]",
          "lg:translate-x-0",
        ].join(" ")}
      >

        {/* =================================================
            BRAND
           ================================================= */}

        <div className="px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200">

              <Sparkles size={24} />

              <span className="absolute right-[-1px] top-[-1px] h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-white" />
            </div>

            <div>
              <h1 className="text-[18px] font-extrabold tracking-tight text-[#172554]">
                Here I Am
              </h1>

              <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                Your Personal Assistant
              </p>
            </div>

            {/* Mobile close */}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-indigo-50 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
           ================================================= */}

        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            {menuItems.map(
              ({
                name,
                path,
                icon: Icon,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={linkClass}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.9}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {name}
                  </span>
                </NavLink>
              )
            )}
          </div>

          {/* =================================================
              PERSONAL MESSAGE CARD
             ================================================= */}

          <div className="mt-5 rounded-[22px] border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50 p-4 shadow-sm">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 shadow-sm">
              <span className="text-lg">
                ☀️
              </span>
            </div>

            <p className="text-[14px] font-bold leading-5 text-[#172554]">
              Small Steps.
              <br />
              Big Progress.
            </p>

            <div className="mt-2 text-lg">
              🌱
            </div>

            <div className="mt-3 h-px bg-indigo-200/70" />

            <p className="mt-4 font-serif text-[23px] italic text-indigo-600">
              Here I Am
            </p>

            <div className="mt-2 space-y-0.5 text-[9px] font-semibold leading-3 text-slate-600">
              <p>Be Present</p>
              <p>Be Productive</p>
              <p>Be You ❤️</p>
            </div>
          </div>
        </nav>

        {/* =================================================
            USER AREA
           ================================================= */}

        <div className="relative border-t border-indigo-100/80 p-4">

          {userMenuOpen && (
            <div className="absolute bottom-[78px] left-4 right-4 z-50 overflow-hidden rounded-2xl border border-indigo-100 bg-white/95 p-2 shadow-[0_20px_60px_rgba(79,70,229,0.18)] backdrop-blur-xl">

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Settings size={18} />
                Settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setUserMenuOpen(
                (value) => !value
              )
            }
            className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-white/75"
          >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md shadow-indigo-200">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#172554]">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">
                Student
              </p>
            </div>

            <ChevronUp
              size={17}
              className={`text-slate-500 transition-transform ${
                userMenuOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}