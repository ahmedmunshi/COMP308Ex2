import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN, REGISTER } from "../graphql/operations";

export default function LoginPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");

  // Login mutation
  const [login, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.login.token);
      onLogin(data.login.user.username, data.login.user.role === "Admin");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Register mutation
  const [register, { loading: registerLoading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.register.token);
      onLogin(data.register.user.username, data.register.user.role === "Admin");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    login({
      variables: {
        email,
        password,
      },
    });
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    if (!username || !password || !email) {
      setError("Please fill in all required fields");
      return;
    }

    register({
      variables: {
        username,
        email,
        password,
        role,
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "signup" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-email">
                Email
              </label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
                Password
              </label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignupSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-username">
                Username
              </label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="signup-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-email">
                Email
              </label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-password">
                Password
              </label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Member"
                    checked={role === "Member"}
                    onChange={() => setRole("Member")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Team Member</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Admin"
                    checked={role === "Admin"}
                    onChange={() => setRole("Admin")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Administrator</span>
                </label>
              </div>
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200"
              type="submit"
              disabled={registerLoading}
            >
              {registerLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
