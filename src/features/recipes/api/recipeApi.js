export const createRecipe = async (recipeData) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recipes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });

  const contentType = res.headers.get("content-type") || "";
  const responseText = await res.text();

  let data = null;
  if (responseText && contentType.includes("application/json")) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  if (!responseText || !contentType.includes("application/json")) {
    if (!res.ok) {
      throw new Error(
        `Request failed with status ${res.status}. Check VITE_API_BASE_URL and backend route availability.`,
      );
    }
    throw new Error(
      "Server returned a non-JSON response. Check API URL or Vite proxy configuration.",
    );
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to create recipe");
  }

  return data;
};
