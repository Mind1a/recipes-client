import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // 🆕
import { likeRecipe, dislikeRecipe } from "../features/recipes/api/recipeApi";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const formatCommentDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setRecipe(data.data);
        setLikes(data.data.likes || 0);
        setDislikes(data.data.dislikes || 0);
        setIsLiked(data.data.isLiked || false);
        setIsDisliked(data.data.isDisliked || false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    const getRecipeComments = async () => {
      try {
        setCommentsLoading(true);

        const res = await fetch(`${API_BASE_URL}/comments/recipe/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load comments");

        setComments(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load comments");
      } finally {
        setCommentsLoading(false);
      }
    };

    getRecipe();
    getRecipeComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const text = commentText.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setCommentSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/comments/recipe/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please sign in to add a comment");
        }
        throw new Error(data.message || "Failed to create comment");
      }

      const newComment = data?.data;
      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
      }

      setCommentText("");
      toast.success(data.message || "Comment added");
    } catch (error) {
      toast.error(error.message || "Failed to create comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

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

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const result = await likeRecipe(id);

      setLikes(result.data.likes);
      setDislikes(result.data.dislikes);
      setIsLiked(result.data.isLiked);
      setIsDisliked(result.data.isDisliked);

      toast.success(result.message);
    } catch (error) {
      toast.error(error.message || "Failed to update like status");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    try {
      setLikeLoading(true);
      const result = await dislikeRecipe(id);

      setLikes(result.data.likes);
      setDislikes(result.data.dislikes);
      setIsLiked(result.data.isLiked);
      setIsDisliked(result.data.isDisliked);

      toast.success(result.message);
    } catch (error) {
      toast.error(error.message || "Failed to update dislike status");
    } finally {
      setLikeLoading(false);
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

      <p className="text-gray-800 leading-7">{recipe.description}</p>

      {/* Like/Dislike Section */}
      <div className="flex gap-4 my-6 pb-6 border-b border-gray-300">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            isLiked
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          👍 Like ({likes})
        </button>

        <button
          onClick={handleDislike}
          disabled={likeLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            isDisliked
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          👎 Dislike ({dislikes})
        </button>
      </div>

      <section className="mt-10">
        <div className="rounded-2xl border border-amber-100 bg-linear-to-br from-amber-50 via-white to-orange-50 shadow-sm">
          <div className="flex items-center justify-between border-b border-amber-100 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {comments.length}
            </span>
          </div>

          <form
            onSubmit={handleCommentSubmit}
            className="border-b border-amber-100 px-6 py-4"
          >
            <label
              htmlFor="commentText"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Add your comment
            </label>
            <textarea
              id="commentText"
              name="commentText"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write something helpful about this recipe..."
              className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={commentSubmitting}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {commentSubmitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          <div className="space-y-4 p-6">
            {commentsLoading ? (
              <p className="text-sm text-gray-600">Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => {
                const username = comment?.user?.username || "Anonymous";
                const profileImg =
                  comment?.user?.profileImg ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                return (
                  <article
                    key={comment._id}
                    className="rounded-xl border border-amber-100 bg-white/90 p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={profileImg}
                          alt={`${username} avatar`}
                          className="h-10 w-10 rounded-full border border-orange-200 object-cover"
                          loading="lazy"
                        />
                        <p className="font-semibold text-gray-900">
                          {username}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500">
                        {formatCommentDate(comment?.createdAt)}
                      </p>
                    </div>

                    <p className="rounded-lg border border-orange-50 bg-orange-50/60 p-3 text-gray-700">
                      {comment?.text || "No comment text"}
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-orange-200 bg-white/70 p-6 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No comments yet. Be the first one to leave feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

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
