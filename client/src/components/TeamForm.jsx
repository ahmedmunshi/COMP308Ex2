import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TEAM, GET_TEAMS, GET_USERS } from "../graphql/operations";

export default function TeamForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
    teamSlogan: "",
    expertiseLevel: "Intermediate",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get users for member selection
  const { loading: usersLoading, data: usersData } = useQuery(GET_USERS);

  // Create team mutation
  const [createTeam, { loading }] = useMutation(CREATE_TEAM, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_TEAMS }],
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMembersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({
      ...formData,
      members: selectedOptions,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description) {
      setError("Team name and description are required");
      return;
    }

    createTeam({
      variables: {
        name: formData.name,
        description: formData.description,
        members: formData.members.length > 0 ? formData.members : undefined,
        teamSlogan: formData.teamSlogan || undefined,
        expertiseLevel: formData.expertiseLevel,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create New Team</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Team created successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Name*</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Slogan</label>
          <input
            type="text"
            name="teamSlogan"
            value={formData.teamSlogan}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Level</label>
          <select
            name="expertiseLevel"
            value={formData.expertiseLevel}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Members (hold Ctrl/Cmd to select multiple)
          </label>
          {usersLoading ? (
            <p className="text-sm text-gray-500">Loading users...</p>
          ) : (
            <select
              name="members"
              multiple
              value={formData.members}
              onChange={handleMembersChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            >
              {usersData?.users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          )}
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
}
