export const createRecipe = async (recipeData) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create recipe");
  }

  return data;
};
