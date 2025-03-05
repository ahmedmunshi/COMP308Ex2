import { useState } from "react";

export default function ProjectList() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Website Redesign",
      description: "Overhaul the company website with modern design",
      status: "In Progress",
      startDate: "2025-02-01",
      endDate: "2025-04-15",
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Create iOS and Android versions of our product",
      status: "Pending",
      startDate: "2025-03-10",
      endDate: "2025-06-30",
    },
    {
      id: "3",
      name: "Customer Dashboard",
      description: "Build analytics dashboard for customers",
      status: "Completed",
      startDate: "2025-01-05",
      endDate: "2025-02-28",
    },
  ]);

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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects assigned yet.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
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
                <span>
                  <span className="font-medium">Due:</span> {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
