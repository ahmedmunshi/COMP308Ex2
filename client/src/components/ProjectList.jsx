import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../graphql/operations";

export default function ProjectList() {
  const { loading, error, data } = useQuery(GET_PROJECTS);

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

  // If no projects are available
  if (!data || !data.projects || data.projects.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Projects</h2>
        <p className="text-gray-500">No projects assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Projects</h2>

      <div className="space-y-6">
        {data.projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="flex text-sm text-gray-500">
              <span className="mr-4">
                <span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}
              </span>
              {project.endDate && (
                <span>
                  <span className="font-medium">Due:</span> {new Date(project.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
