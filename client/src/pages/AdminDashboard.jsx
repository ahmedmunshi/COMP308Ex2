import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TEAMS, GET_PROJECTS, GET_USERS, DELETE_TEAM, DELETE_PROJECT, DELETE_USER } from "../graphql/operations";
import TeamForm from "../components/TeamForm";
import TeamEditForm from "../components/TeamEditForm";
import ProjectForm from "../components/ProjectForm";
import ProjectEditForm from "../components/ProjectEditForm";
import TeamManagement from "../components/TeamManagement";
import ProjectManagement from "../components/ProjectManagement";
import UserManagement from "../components/UserManagement";

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
