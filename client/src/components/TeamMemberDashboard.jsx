import TeamDetails from "../pages/TeamDetails";
import ProjectList from "../pages/ProjectList";
import ProjectStatusUpdate from "../pages/ProjectStatusUpdate";

export default function TeamMemberDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Member Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TeamDetails />
          <ProjectList />
        </div>
        <div>
          <ProjectStatusUpdate />
        </div>
      </div>
    </div>
  );
}
