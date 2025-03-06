import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, isAdmin, username, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold hover:text-gray-300">
              TeamSync
            </Link>
          </div>

          {/* Desktop view links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="px-3 py-2 rounded-md text-lg font-medium text-gray-300">Welcome, {username}</span>

                  {isAdmin ? (
                    <Link to="/admin-dashboard" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/member-dashboard" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                      Member Dashboard
                    </Link>
                  )}
                  <button onClick={onLogout} className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger menu button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view links */}
      <div className={`md:hidden ${showMenu ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isLoggedIn ? (
            <>
              <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-300">
                Welcome, {username}
              </span>

              {isAdmin ? (
                <Link
                  to="/admin-dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/member-dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  Member Dashboard
                </Link>
              )}
              <button
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
