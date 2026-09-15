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
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "My CV",
      path: "/cv",
      icon: FileText,
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
  ];

  const bottomItems = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#1E293B] bg-[#111827] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#1E293B] px-6">
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">
              Here <span className="text-[#60A5FA]">|</span> Am
            </h1>

            <p className="text-xs text-[#64748B]">
              Personal Assistant
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#2563EB]/15 text-[#60A5FA]"
                        : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
                    }`
                  }
                >
                  <Icon size={20} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-[#1E293B] px-3 py-4">
          {bottomItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#2563EB]/15 text-[#60A5FA]"
                      : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#94A3B8] transition hover:bg-[#EF4444]/10 hover:text-[#FCA5A5]"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}