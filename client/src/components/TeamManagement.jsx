import { GET_TEAMS, DELETE_TEAM } from "../graphql/operations";
import { useQuery, useMutation } from "@apollo/client";

export default function TeamManagement({ onAddTeam, onEditTeam }) {
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
