import { useState } from "react";

export default function AdminDashboard() {
  // Manage selection of teams, projects, and users
  const [activeTab, setActiveTab] = useState("teams");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="mb-8 border-b">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("teams")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "teams" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Manage Teams
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "projects"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === "teams" && <TeamManagement />}
          {activeTab === "projects" && <ProjectManagement />}
          {activeTab === "users" && <UserManagement />}
        </div>
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                Create New Team
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                Create New Project
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
                Add New User
              </button>
              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition">
                Generate Reports
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Teams</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold">37</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered Users</p>
                <p className="text-2xl font-bold">116</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Server Status</p>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Management Component
function TeamManagement() {
  const [teams, setTeams] = useState([
    {
      id: "1",
      name: "Frontend Team",
      description: "Responsible for UI/UX implementation",
      status: "Active",
      members: 8,
      expertiseLevel: "Advanced",
    },
    {
      id: "2",
      name: "Backend Team",
      description: "API development and database management",
      status: "Active",
      members: 6,
      expertiseLevel: "Expert",
    },
    {
      id: "3",
      name: "QA Team",
      description: "Quality assurance and testing",
      status: "Active",
      members: 4,
      expertiseLevel: "Intermediate",
    },
    {
      id: "4",
      name: "DevOps Team",
      description: "Infrastructure and deployment",
      status: "Inactive",
      members: 3,
      expertiseLevel: "Expert",
    },
  ]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Team Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
          Add New Team
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Members
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Expertise
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{team.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{team.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      team.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {team.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.members}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.expertiseLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Project Management Component
function ProjectManagement() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      team: "Frontend Team",
      status: "In Progress",
      startDate: "2025-01-15",
      endDate: "2025-03-30",
    },
    {
      id: "2",
      name: "API Integration",
      description: "Connecting to third-party payment services",
      team: "Backend Team",
      status: "Pending",
      startDate: "2025-02-01",
      endDate: "2025-04-15",
    },
    {
      id: "3",
      name: "Mobile App Development",
      description: "Building iOS and Android versions of main product",
      team: "Frontend Team",
      status: "In Progress",
      startDate: "2024-11-10",
      endDate: "2025-05-20",
    },
    {
      id: "4",
      name: "Database Migration",
      description: "Moving from SQL to NoSQL for better performance",
      team: "Backend Team",
      status: "Completed",
      startDate: "2024-12-05",
      endDate: "2025-01-10",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Project Management</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition">
          Add New Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Project Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Timeline
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.team}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "johndoe",
      email: "john.doe@example.com",
      role: "Admin",
      team: "Management",
      status: "Active",
    },
    {
      id: "2",
      username: "janedoe",
      email: "jane.doe@example.com",
      role: "Member",
      team: "Frontend Team",
      status: "Active",
    },
    {
      id: "3",
      username: "bobsmith",
      email: "bob.smith@example.com",
      role: "Member",
      team: "Backend Team",
      status: "Active",
    },
    {
      id: "4",
      username: "alicejohnson",
      email: "alice.johnson@example.com",
      role: "Member",
      team: "QA Team",
      status: "Inactive",
    },
  ]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.team}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
