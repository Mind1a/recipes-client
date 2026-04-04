import { useState } from "react";
import { createRecipe } from "../api/recipeApi";

const CreateRecipeForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "easy",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        ...form,
        ingredients: [],
        steps: [],
      };

      await createRecipe(payload);

      setMessage("✅ Recipe created successfully");

      setForm({
        title: "",
        description: "",
        category: "",
        difficulty: "easy",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded-xl"
    >
      <h2 className="text-xl font-bold mb-4">Create Recipe</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        name="difficulty"
        value={form.difficulty}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {message && <p className="mt-3 text-sm text-center">{message}</p>}
    </form>
  );
};

export default CreateRecipeForm;
