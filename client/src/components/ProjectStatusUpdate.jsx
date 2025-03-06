import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROJECTS, UPDATE_PROJECT_STATUS } from "../graphql/operations";

export default function ProjectStatusUpdate() {
  const [selectedProject, setSelectedProject] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdated, setStatusUpdated] = useState(false);

  // Fetch projects
  const { loading, error, data } = useQuery(GET_PROJECTS);

  // Update project status mutation
  const [updateProjectStatus, { loading: updateLoading }] = useMutation(UPDATE_PROJECT_STATUS, {
    onCompleted: () => {
      setStatusUpdated(true);
      setTimeout(() => setStatusUpdated(false), 3000); // Clear message after 3 seconds
    },
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    const project = data?.projects.find((p) => p.id === e.target.value);
    if (project) {
      setNewStatus(project.status);
    }
    setStatusUpdated(false);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject || !newStatus) return;

    updateProjectStatus({
      variables: {
        id: selectedProject,
        status: newStatus,
      },
    });
  };

  if (loading) return <div className="bg-white shadow rounded-lg p-6">Loading projects...</div>;

  if (error)
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Error loading projects: {error.message}</p>
      </div>
    );

  // If no projects are available
  if (!data || !data.projects || data.projects.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Project Status</h2>
        <p className="text-gray-500">No projects available to update.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Project Status</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          <select
            id="project"
            value={selectedProject}
            onChange={handleProjectChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select a project --</option>
            {data.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={newStatus}
              onChange={handleStatusChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedProject || updateLoading}
          className={`px-4 py-2 rounded-md font-medium ${
            !selectedProject || updateLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {updateLoading ? "Updating..." : "Update Status"}
        </button>

        {statusUpdated && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">Status updated successfully!</div>
        )}
      </form>
    </div>
  );
}
