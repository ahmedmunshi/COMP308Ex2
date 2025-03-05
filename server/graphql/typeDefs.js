// graphql/typeDefs.js
const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type Team {
    id: ID!
    name: String!
    description: String!
    members: [User]
    createdDate: String!
    status: String!
    teamSlogan: String
    expertiseLevel: String
  }

  type Project {
    id: ID!
    name: String!
    description: String!
    team: Team!
    startDate: String!
    endDate: String
    status: String!
    createdAt: String!
  }

  type AuthResponse {
    token: String
    user: User
  }

  type Query {
    # User queries
    me: User
    users: [User]
    user(id: ID!): User

    # Team queries
    teams: [Team]
    team(id: ID!): Team
    teamsByMember(userId: ID!): [Team]

    # Project queries
    projects: [Project]
    project(id: ID!): Project
    projectsByTeam(teamId: ID!): [Project]
  }

  type Mutation {
    # Auth mutations
    register(username: String!, email: String!, password: String!, role: String): AuthResponse
    login(email: String!, password: String!): AuthResponse
    logout: Boolean

    # User mutations
    updateUser(id: ID!, username: String, email: String, role: String): User
    deleteUser(id: ID!): Boolean

    # Team mutations
    createTeam(name: String!, description: String!, members: [ID!], teamSlogan: String, expertiseLevel: String): Team
    updateTeam(id: ID!, name: String, description: String, members: [ID], status: String, teamSlogan: String, expertiseLevel: String): Team
    deleteTeam(id: ID!): Boolean
    addMemberToTeam(teamId: ID!, userId: ID!): Team
    removeMemberFromTeam(teamId: ID!, userId: ID!): Team

    # Project mutations
    createProject(name: String!, description: String!, teamId: ID!, startDate: String!, endDate: String, status: String): Project
    updateProject(id: ID!, name: String, description: String, teamId: ID, startDate: String, endDate: String, status: String): Project
    deleteProject(id: ID!): Boolean
    updateProjectStatus(id: ID!, status: String!): Project
  }
`;

module.exports = typeDefs;