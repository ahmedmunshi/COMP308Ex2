import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TEAM, GET_TEAMS, GET_USERS } from "../graphql/operations";

export default function TeamEditForm({ team, onClose }) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [status, setStatus] = useState(team.status);
  const [teamSlogan, setTeamSlogan] = useState(team.teamSlogan || "");
  const [expertiseLevel, setExpertiseLevel] = useState(team.expertiseLevel || "Intermediate");
  const [members, setMembers] = useState(team.members?.map((member) => member.id) || []);
  const [error, setError] = useState("");

  // Get all users for member selection
  const { loading: usersLoading, data: usersData } = useQuery(GET_USERS);

  // Update team mutation
  const [updateTeam, { loading }] = useMutation(UPDATE_TEAM, {
    onCompleted: () => {
      onClose();
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_TEAMS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("Name and description are required");
      return;
    }

    updateTeam({
      variables: {
        id: team.id,
        name,
        description,
        status,
        teamSlogan,
        expertiseLevel,
        members,
      },
    });
  };

  const handleMemberChange = (userId) => {
    setMembers((prevMembers) =>
      prevMembers.includes(userId) ? prevMembers.filter((id) => id !== userId) : [...prevMembers, userId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Edit Team</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="teamSlogan" className="block text-sm font-medium text-gray-700 mb-1">
              Team Slogan
            </label>
            <input
              type="text"
              id="teamSlogan"
              value={teamSlogan}
              onChange={(e) => setTeamSlogan(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="expertiseLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Expertise Level
            </label>
            <select
              id="expertiseLevel"
              value={expertiseLevel}
              onChange={(e) => setExpertiseLevel(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {usersLoading ? (
                <p className="text-gray-500">Loading users...</p>
              ) : (
                usersData?.users?.map((user) => (
                  <div key={user.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={members.includes(user.id)}
                      onChange={() => handleMemberChange(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`user-${user.id}`} className="ml-2 text-sm text-gray-700">
                      {user.username} ({user.email})
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
