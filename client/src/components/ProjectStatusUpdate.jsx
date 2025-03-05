import { useState } from "react";

export default function ProjectStatusUpdate() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Website Redesign",
      status: "In Progress",
    },
    {
      id: "2",
      name: "Mobile App Development",
      status: "Pending",
    },
    {
      id: "3",
      name: "Customer Dashboard",
      status: "Completed",
    },
  ]);

  const [selectedProject, setSelectedProject] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdated, setStatusUpdated] = useState(false);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    const project = projects.find((p) => p.id === e.target.value);
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

    // Update the project status in our local state
    setProjects(
      projects.map((project) => (project.id === selectedProject ? { ...project, status: newStatus } : project))
    );

    setStatusUpdated(true);

    // This would be where we submit to the API in a real implementation
  };

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
            {projects.map((project) => (
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
          disabled={!selectedProject}
          className={`px-4 py-2 rounded-md font-medium ${
            !selectedProject ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Update Status
        </button>

        {statusUpdated && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">Status updated successfully!</div>
        )}
      </form>
    </div>
  );
}
