import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="light-app min-h-screen overflow-x-hidden text-[#172554]">

      {/* =================================================
          BACKGROUND DECORATION
         ================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-300/25 blur-[120px]" />

        <div className="absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-purple-300/25 blur-[120px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[500px] w-[500px] rounded-full bg-sky-300/25 blur-[120px]" />

        <div className="absolute left-[45%] top-[42%] h-[320px] w-[320px] rounded-full bg-pink-200/20 blur-[110px]" />
      </div>

      {/* =================================================
          SIDEBAR
         ================================================= */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* =================================================
          MAIN AREA
         ================================================= */}

      <div className="min-h-screen lg:ml-[308px]">

        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="px-4 pb-12 pt-5 sm:px-6 lg:px-7">
          <div className="mx-auto w-full max-w-[1500px]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}