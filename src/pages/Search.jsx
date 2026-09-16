import { useState } from "react";
import {
  Search as SearchIcon,
  ExternalLink,
  Globe,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import { searchWeb } from "../services/searchService";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestions = [
    "Latest technology",
    "Artificial Intelligence",
    "React tutorials",
    "Machine Learning",
    "Cybersecurity",
    "Web development",
  ];

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter something to search.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const data = await searchWeb(trimmedQuery);

      setSearchedQuery(data.query);
      setAnswer(data.answer || "");
      setSources(data.sources || []);
    } catch (err) {
      console.error("Search error:", err);

      setError(
        err?.message ||
          "Something went wrong while searching the web."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
    setError("");
  };

  const handleNewSearch = () => {
    setQuery("");
    setSearchedQuery("");
    setAnswer("");
    setSources([]);
    setError("");
  };

  return (
    <div className="space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-indigo-200">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
              Here I Am
            </p>

            <h1 className="text-3xl font-black tracking-tight text-[#172554]">
              Web Search
            </h1>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Search the web with AI-powered results.
        </p>
      </div>

      {/* =====================================================
          SEARCH BOX
      ===================================================== */}
      <div className="rounded-[24px] border border-white/80 bg-white/60 p-4 shadow-[0_20px_55px_rgba(79,70,229,0.10)] backdrop-blur-xl sm:p-6">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Input */}
            <div className="relative min-w-0 flex-1">
              <SearchIcon
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
              />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="What do you want to search?"
                className="h-[58px] w-full rounded-2xl border border-indigo-100 bg-white/80 py-4 pl-12 pr-4 text-sm font-medium text-[#172554] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon size={19} />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        )}
      </div>

      {/* =====================================================
          INITIAL SUGGESTIONS
      ===================================================== */}
      {!searchedQuery && !loading && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#172554]">
                Try searching for
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Quick searches to get you started
              </p>
            </div>

            <Globe
              size={22}
              className="text-indigo-300"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() =>
                  handleSuggestion(suggestion)
                }
                className="group rounded-2xl border border-indigo-100 bg-white/65 p-4 text-left shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 transition group-hover:bg-indigo-100">
                    <Globe size={19} />
                  </div>

                  <div className="min-w-0">
                    <span className="block truncate text-sm font-bold text-[#172554]">
                      {suggestion}
                    </span>

                    <span className="mt-0.5 block text-[11px] text-slate-400">
                      Search the web
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading && (
        <div className="rounded-[24px] border border-indigo-100 bg-white/60 px-6 py-16 text-center shadow-[0_18px_50px_rgba(79,70,229,0.08)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <Loader2
              size={30}
              className="animate-spin"
            />
          </div>

          <p className="mt-5 text-sm font-bold text-[#172554]">
            Searching the web...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Gemini is finding relevant information.
          </p>
        </div>
      )}

      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}
      {searchedQuery && !loading && !error && (
        <div className="space-y-6">
          {/* Result Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500">
                Search results for
              </p>

              <h2 className="mt-1 break-words text-xl font-black text-[#172554]">
                "{searchedQuery}"
              </h2>
            </div>

            <button
              type="button"
              onClick={handleNewSearch}
              className="flex items-center gap-2 self-start rounded-xl border border-indigo-100 bg-white/65 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-white hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              New Search
            </button>
          </div>

          {/* =================================================
              AI ANSWER
          ================================================= */}
          {answer && (
            <div className="rounded-[24px] border border-indigo-100 bg-white/65 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/15 text-indigo-500">
                  <Sparkles size={21} />
                </div>

                <div>
                  <h3 className="font-black text-[#172554]">
                    AI Web Summary
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Powered by Gemini with Google Search
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {answer}
              </div>
            </div>
          )}

          {/* =================================================
              SOURCES
          ================================================= */}
          {sources.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#172554]">
                    Web Sources
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    References used for the answer
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                  {sources.length} source
                  {sources.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {sources.map((source, index) => (
                  <a
                    key={`${source.url}-${index}`}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border border-indigo-100 bg-white/65 p-5 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-100"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                        <Globe size={19} />
                      </div>

                      {/* Source Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-[#172554] transition group-hover:text-indigo-600">
                            {source.title ||
                              "Web Source"}
                          </h4>

                          <ExternalLink
                            size={17}
                            className="shrink-0 text-slate-300 transition group-hover:text-indigo-500"
                          />
                        </div>

                        <p className="mt-2 break-all text-xs leading-5 text-slate-400">
                          {source.url}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* =================================================
              NO RESULTS
          ================================================= */}
          {!answer && sources.length === 0 && (
            <div className="rounded-[24px] border border-indigo-100 bg-white/60 p-10 text-center shadow-sm backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <Globe size={30} />
              </div>

              <h3 className="mt-4 font-black text-[#172554]">
                No results found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Try searching with a different query.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          INFORMATION CARD
      ===================================================== */}
      {!searchedQuery && !loading && (
        <div className="rounded-[22px] border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white/60 to-purple-50/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Globe size={20} />
            </div>

            <div>
              <h3 className="font-black text-[#172554]">
                Basic Web Search
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Search for current information from the web
                and get an AI-powered summary with relevant
                web sources directly inside Here I Am.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}