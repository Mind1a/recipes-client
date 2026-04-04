import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // 🆕

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setRecipe(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    getRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ success toast
      toast.success("Recipe deleted successfully");

      setShowConfirm(false);

      // redirect
      navigate("/recipes");
    } catch (err) {
      // ❌ error toast
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div>
      {/* Title + Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>

        <div className="flex gap-2">
          <Link
            to={`/recipes/${id}/edit`}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit
          </Link>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        {recipe.category} • {recipe.difficulty}
      </p>

      <p>{recipe.description}</p>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">Delete Recipe?</h2>

            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded"
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
