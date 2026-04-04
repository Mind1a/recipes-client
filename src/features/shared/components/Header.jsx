import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const baseStyles = "transition-colors";
  const activeStyles = "text-yellow-400";
  const inactiveStyles = "hover:text-yellow-400";

  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/">
          <h1 className="text-xl font-bold">My App</h1>
        </Link>

        <nav className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
            }
          >
            Recipes
          </NavLink>

          {/* NEW */}
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
            }
          >
            Create Recipe
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
