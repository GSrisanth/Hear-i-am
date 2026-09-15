import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">
      <Sidebar />

      <div className="lg:ml-64">
        <Navbar />

        <main className="min-h-[calc(100vh-64px)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}