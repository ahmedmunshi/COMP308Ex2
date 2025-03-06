import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PROJECT, GET_PROJECTS, GET_TEAMS } from "../graphql/operations";

export default function ProjectForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
    startDate: new Date().toISOString().split("T")[0], // Current date as default
    endDate: "",
    status: "Pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get teams for team selection
  const { loading: teamsLoading, data: teamsData } = useQuery(GET_TEAMS);

  // Create project mutation
  const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description || !formData.teamId || !formData.startDate) {
      setError("Project name, description, team, and start date are required");
      return;
    }

    createProject({
      variables: {
        name: formData.name,
        description: formData.description,
        teamId: formData.teamId,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        status: formData.status,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Project created successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Team*</label>
          {teamsLoading ? (
            <p className="text-sm text-gray-500">Loading teams...</p>
          ) : (
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Team --</option>
              {teamsData?.teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
