import { useState } from "react";

export default function TeamDetails() {
  const [team, setTeam] = useState({
    id: "1",
    name: "Frontend Development",
    description: "Responsible for creating user interfaces and experiences",
    status: "Active",
    createdDate: "2025-01-15",
    slogan: "Building interfaces that users love",
    members: [
      { id: "1", username: "jsmith", email: "jsmith@example.com" },
      { id: "2", username: "agarcia", email: "agarcia@example.com" },
      { id: "3", username: "pwilliams", email: "pwilliams@example.com" },
    ],
  });

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
      <p className="text-sm text-gray-500 italic mb-4">"{team.slogan}"</p>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Team Members</h3>
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
      </div>

      <div className="mt-4 text-sm text-gray-500">Created on {new Date(team.createdDate).toLocaleDateString()}</div>
    </div>
  );
}
