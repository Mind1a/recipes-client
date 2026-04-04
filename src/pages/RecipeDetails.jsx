import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error fetching recipe");
        }

        setRecipe(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

      <p className="text-gray-600 mb-4">
        {recipe.category} • {recipe.difficulty}
      </p>

      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeDetails;
