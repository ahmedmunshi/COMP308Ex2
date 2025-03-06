import { useQuery } from "@apollo/client";
import { GET_TEAMS } from "../graphql/operations";

export default function TeamDetails() {
  const { loading, error, data } = useQuery(GET_TEAMS);

  if (loading) return <div className="bg-white shadow rounded-lg p-6 mb-6">Loading team details...</div>;

  if (error)
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="text-red-500">Error loading team details: {error.message}</p>
      </div>
    );

  // If no teams are available
  if (!data || !data.teams || data.teams.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">No Teams Available</h2>
        <p className="text-gray-600 mt-2">You are not assigned to any teams yet.</p>
      </div>
    );
  }

  // Use the first team for display
  const team = data.teams[0];

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            team.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {team.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{team.description}</p>
      {team.teamSlogan && <p className="text-sm text-gray-500 italic mb-4">"{team.teamSlogan}"</p>}

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Team Members</h3>
        {team.members && team.members.length > 0 ? (
          <ul className="space-y-2">
            {team.members.map((member) => (
              <li key={member.id} className="flex items-center">
                <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{member.username}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members in this team yet.</p>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">Created on {new Date(team.createdDate).toLocaleDateString()}</div>
    </div>
  );
}
