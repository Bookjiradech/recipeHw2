import { NavLink } from "react-router-dom";

export default function Navbar() {
  // Function to apply Tailwind classes based on whether the link is active
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    // Base classes for styling, transition, and focus
    `px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
      // Conditional styling based on active state
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50" // Active: Primary color background, strong shadow
        : "text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700/70" // Inactive: Subtle hover effect
    }`;

  return (
    // Added w-full explicitly to ensure it spans the entire width, 
    // reinforcing the sticky top-0 behavior.
    <nav className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          
          {/* Brand/Logo Link - Made text slightly larger and bolder */}
          <NavLink 
            to="/" 
            className="text-3xl font-black text-indigo-700 dark:text-indigo-300 hover:text-indigo-500 transition-colors tracking-tighter"
          >
            Recipe Finder
          </NavLink>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              Favorites
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
