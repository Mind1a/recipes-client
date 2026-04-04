import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Header from "./features/shared/components/Header";
import RecipeDetails from "./pages/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />

        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/recipes/:id/edit" element={<EditRecipe />} />
            <Route path="/create" element={<CreateRecipe />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
