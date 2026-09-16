export async function searchWeb(query) {
  const trimmedQuery =
    query.trim();

  if (!trimmedQuery) {
    throw new Error(
      "Please enter a search query."
    );
  }

  const response = await fetch(
    "/api/search",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        query: trimmedQuery,
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The search service returned an invalid response."
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Web search failed."
    );
  }

  return data;
}