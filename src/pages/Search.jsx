import { useState } from "react";
import {
  Search as SearchIcon,
  ExternalLink,
  Globe,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { searchWeb } from "../services/searchService";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        err.message ||
          "Something went wrong while searching the web."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
  };

  const handleNewSearch = () => {
    setQuery("");
    setSearchedQuery("");
    setAnswer("");
    setSources([]);
    setError("");
  };

  const suggestions = [
    "Latest technology",
    "Artificial Intelligence",
    "React tutorials",
    "Machine Learning",
    "Cybersecurity",
    "Web development",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Web Search
        </h1>

        <p className="mt-2 text-slate-400">
          Search the web with AI-powered results.
        </p>
      </div>

      {/* Search Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="What do you want to search?"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Initial Suggestions */}
      {!searchedQuery && !loading && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Try searching for
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() =>
                  handleSuggestion(suggestion)
                }
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-slate-300 transition hover:border-blue-500/50 hover:bg-slate-800 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Globe
                      size={18}
                      className="text-blue-400"
                    />
                  </div>

                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 py-16">
          <Loader2
            size={40}
            className="animate-spin text-blue-500"
          />

          <p className="mt-4 font-medium text-white">
            Searching the web...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Gemini is finding relevant information.
          </p>
        </div>
      )}

      {/* Results */}
      {searchedQuery && !loading && !error && (
        <div className="space-y-6">
          {/* Result Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Search results for
              </p>

              <h2 className="text-xl font-semibold text-white">
                "{searchedQuery}"
              </h2>
            </div>

            <button
              onClick={handleNewSearch}
              className="flex items-center gap-2 self-start rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
            >
              <ArrowLeft size={16} />
              New Search
            </button>
          </div>

          {/* AI Answer */}
          {answer && (
            <div className="rounded-2xl border border-blue-500/20 bg-slate-900/70 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Globe
                    size={22}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    AI Web Summary
                  </h3>

                  <p className="text-xs text-slate-500">
                    Powered by Gemini with Google Search
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-line text-[15px] leading-7 text-slate-300">
                {answer}
              </div>
            </div>
          )}

          {/* Sources */}
          {sources.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Web Sources
                </h3>

                <span className="text-sm text-slate-500">
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
                    className="group block rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-blue-500/50 hover:bg-slate-800/80"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                        <Globe
                          size={19}
                          className="text-blue-400"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-semibold text-white transition group-hover:text-blue-400">
                            {source.title ||
                              "Web Source"}
                          </h4>

                          <ExternalLink
                            size={17}
                            className="shrink-0 text-slate-600 transition group-hover:text-blue-400"
                          />
                        </div>

                        <p className="mt-2 break-all text-sm text-slate-500">
                          {source.url}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* No sources */}
          {!answer && sources.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
              <Globe
                size={40}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 font-semibold text-white">
                No results found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try searching with a different query.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Information */}
      {!searchedQuery && !loading && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex gap-3">
            <Globe
              size={21}
              className="mt-0.5 shrink-0 text-blue-400"
            />

            <div>
              <h3 className="font-semibold text-white">
                Basic Web Search
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
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