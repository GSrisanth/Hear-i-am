export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-[#2563EB]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-[#F8FAFC]">
          Page not found
        </h2>

        <p className="mt-2 text-[#94A3B8]">
          The page you're looking for doesn't exist.
        </p>

        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}