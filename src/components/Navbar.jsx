import { Bell, Menu, Search } from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#1E293B] bg-[#0B1120]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-2 rounded-xl border border-[#1E293B] bg-[#111827] px-3 py-2 sm:flex">
          <Search size={17} className="text-[#64748B]" />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-[#64748B] md:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-xl border border-[#1E293B] bg-[#111827] p-2.5 text-[#94A3B8] transition hover:border-[#2563EB] hover:text-white">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2563EB]" />
        </button>

        <div className="flex items-center gap-3 border-l border-[#1E293B] pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">Srisanth</p>
            <p className="text-xs text-[#64748B]">Student</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] font-semibold text-white">
            S
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;