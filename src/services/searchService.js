export async function searchWeb(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    throw new Error("Please enter a search query.");
  }

  const response = await fetch("http://localhost:3001/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: trimmedQuery,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Web search failed."
    );
  }

  return data;
}