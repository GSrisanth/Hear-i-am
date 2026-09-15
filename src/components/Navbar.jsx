import { Menu } from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#1E293B] bg-[#0B1120]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">
              Srisanth
            </p>
            <p className="text-xs text-[#64748B]">
              Student
            </p>
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