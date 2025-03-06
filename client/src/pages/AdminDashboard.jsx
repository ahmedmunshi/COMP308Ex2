import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TEAMS, GET_PROJECTS, GET_USERS, DELETE_TEAM, DELETE_PROJECT, DELETE_USER } from "../graphql/operations";
import TeamForm from "../components/TeamForm";
import TeamEditForm from "../components/TeamEditForm";
import ProjectForm from "../components/ProjectForm";
import ProjectEditForm from "../components/ProjectEditForm";

export default function AdminDashboard() {
  // Manage selection of teams, projects, and users
  const [activeTab, setActiveTab] = useState("teams");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Queries for stats
  const { data: teamsData } = useQuery(GET_TEAMS);
  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: usersData } = useQuery(GET_USERS);

  // Count statistics
  const totalTeams = teamsData?.teams?.length || 0;
  const activeProjects = projectsData?.projects?.filter((p) => p.status === "In Progress").length || 0;
  const totalUsers = usersData?.users?.length || 0;

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

      {/* Team Form Modal */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <TeamForm onClose={() => setShowTeamForm(false)} />
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <ProjectForm onClose={() => setShowProjectForm(false)} />
          </div>
        </div>
      )}

      {/* Team Edit Form Modal */}
      {teamToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <TeamEditForm team={teamToEdit} onClose={() => setTeamToEdit(null)} />
          </div>
        </div>
      )}

      {/* Project Edit Form Modal */}
      {projectToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <ProjectEditForm project={projectToEdit} onClose={() => setProjectToEdit(null)} />
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === "teams" && (
            <TeamManagement onAddTeam={() => setShowTeamForm(true)} onEditTeam={(team) => setTeamToEdit(team)} />
          )}
          {activeTab === "projects" && (
            <ProjectManagement
              onAddProject={() => setShowProjectForm(true)}
              onEditProject={(project) => setProjectToEdit(project)}
            />
          )}
          {activeTab === "users" && <UserManagement />}
        </div>
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setActiveTab("teams");
                  setShowTeamForm(true);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Create New Team
              </button>
              <button
                onClick={() => {
                  setActiveTab("projects");
                  setShowProjectForm(true);
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Create New Project
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
              >
                Manage Users
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Teams</p>
                <p className="text-2xl font-bold">{totalTeams}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold">{activeProjects}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
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
function TeamManagement({ onAddTeam, onEditTeam }) {
  const { loading, error, data } = useQuery(GET_TEAMS);
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    refetchQueries: [{ query: GET_TEAMS }],
  });

  const handleDeleteTeam = (id) => {
    if (window.confirm("Are you sure you want to delete this team? This will also delete all associated projects.")) {
      deleteTeam({ variables: { id } });
    }
  };

  if (loading) return <div className="bg-white shadow rounded-lg p-6">Loading teams...</div>;

  if (error)
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Error loading teams: {error.message}</p>
      </div>
    );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Team Management</h2>
        <button
          onClick={onAddTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
        >
          Add New Team
        </button>
      </div>

      {data?.teams?.length > 0 ? (
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
              {data.teams.map((team) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.members?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.expertiseLevel || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4" onClick={() => onEditTeam(team)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteTeam(team.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No teams available yet.</p>
      )}
    </div>
  );
}

// Project Management Component
function ProjectManagement({ onAddProject, onEditProject }) {
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject({ variables: { id } });
    }
  };

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

  if (loading) return <div className="bg-white shadow rounded-lg p-6">Loading projects...</div>;

  if (error)
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Error loading projects: {error.message}</p>
      </div>
    );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Project Management</h2>
        <button
          onClick={onAddProject}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition"
        >
          Add New Project
        </button>
      </div>

      {data?.projects?.length > 0 ? (
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
              {data.projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.team?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.startDate && new Date(project.startDate).toLocaleDateString()} -
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4" onClick={() => onEditProject(project)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteProject(project.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No projects available yet.</p>
      )}
    </div>
  );
}

// User Management Component
function UserManagement() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser({ variables: { id } });
    }
  };

  if (loading) return <div className="bg-white shadow rounded-lg p-6">Loading users...</div>;

  if (error)
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
          Add New User
        </button>
      </div>

      {data?.users?.length > 0 ? (
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
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.users.map((user) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No users available yet.</p>
      )}
    </div>
  );
}
