import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Sparkles,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name || "Srisanth";

  const initial =
    displayName.charAt(0).toUpperCase();

  const handleSearch = (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      navigate("/search");
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(value)}`
    );
  };

  const goToProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const goToSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-7">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-3 rounded-[24px] border border-white/70 bg-white/55 px-3 shadow-[0_18px_50px_rgba(79,70,229,0.08)] backdrop-blur-2xl sm:px-4">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/75 text-[#172554] shadow-sm lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="min-w-0 flex-1"
        >
          <div className="relative max-w-[520px]">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
            />

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Ask me anything..."
              className="h-11 w-full rounded-full border border-indigo-100 bg-white/75 pl-11 pr-12 text-sm text-[#172554] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />

            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-indigo-200 hover:scale-105"
              aria-label="Search"
            >
              <span className="text-lg leading-none">
                →
              </span>
            </button>
          </div>
        </form>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2">

          {/* AI indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-white/65 px-3 py-2 text-xs font-medium text-indigo-600 md:flex">
            <Sparkles size={15} />
            <span>AI Assistant</span>
          </div>

          {/* Notification */}
          <button
            type="button"
            onClick={() => navigate("/reminders")}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/70 text-[#172554] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Reminders"
          >
            <Bell size={19} />

            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen((value) => !value)
              }
              className="flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/70 px-2 shadow-sm hover:shadow-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md">
                {initial}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[100px] truncate text-xs font-bold text-[#172554]">
                  {displayName}
                </p>

                <p className="text-[10px] text-slate-500">
                  Student
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`mr-1 text-slate-500 transition-transform ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {profileOpen && (
              <>
                {/* Click outside */}
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  aria-label="Close profile menu"
                />

                {/* Popup */}
                <div className="absolute right-0 top-[58px] z-50 w-64 overflow-hidden rounded-2xl border border-indigo-100 bg-white/95 p-2 shadow-[0_25px_70px_rgba(79,70,229,0.18)] backdrop-blur-xl">

                  <div className="mb-1 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#172554]">
                          {displayName}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user?.email || "Student"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goToProfile}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <User size={18} />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={goToSettings}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Sparkles size={18} />
                    Settings
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}