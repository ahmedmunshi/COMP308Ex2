import { gql } from "@apollo/client";

// Auth Queries and Mutations
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const CURRENT_USER = gql`
  query CurrentUser {
    me {
      id
      username
      email
      role
    }
  }
`;

// Team Queries and Mutations
export const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
      name
      description
      status
      teamSlogan
      expertiseLevel
      members {
        id
        username
        email
      }
      createdDate
    }
  }
`;

export const GET_TEAM = gql`
  query GetTeam($id: ID!) {
    team(id: $id) {
      id
      name
      description
      status
      teamSlogan
      expertiseLevel
      members {
        id
        username
        email
      }
      createdDate
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation CreateTeam(
    $name: String!
    $description: String!
    $members: [ID!]
    $teamSlogan: String
    $expertiseLevel: String
  ) {
    createTeam(
      name: $name
      description: $description
      members: $members
      teamSlogan: $teamSlogan
      expertiseLevel: $expertiseLevel
    ) {
      id
      name
      description
      status
      teamSlogan
      expertiseLevel
      members {
        id
        username
      }
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $teamSlogan: String
    $expertiseLevel: String
  ) {
    updateTeam(
      id: $id
      name: $name
      description: $description
      status: $status
      teamSlogan: $teamSlogan
      expertiseLevel: $expertiseLevel
    ) {
      id
      name
      description
      status
      teamSlogan
      expertiseLevel
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id)
  }
`;

export const ADD_MEMBER_TO_TEAM = gql`
  mutation AddMemberToTeam($teamId: ID!, $userId: ID!) {
    addMemberToTeam(teamId: $teamId, userId: $userId) {
      id
      name
      members {
        id
        username
      }
    }
  }
`;

export const REMOVE_MEMBER_FROM_TEAM = gql`
  mutation RemoveMemberFromTeam($teamId: ID!, $userId: ID!) {
    removeMemberFromTeam(teamId: $teamId, userId: $userId) {
      id
      name
      members {
        id
        username
      }
    }
  }
`;

// Project Queries and Mutations
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      startDate
      endDate
      team {
        id
        name
        members {
          id
          username
        }
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      startDate
      endDate
      team {
        id
        name
        members {
          id
          username
        }
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String!
    $teamId: ID!
    $startDate: String!
    $endDate: String
    $status: String
  ) {
    createProject(
      name: $name
      description: $description
      teamId: $teamId
      startDate: $startDate
      endDate: $endDate
      status: $status
    ) {
      id
      name
      description
      status
      startDate
      endDate
      team {
        id
        name
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $teamId: ID
    $startDate: String
    $endDate: String
    $status: String
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      teamId: $teamId
      startDate: $startDate
      endDate: $endDate
      status: $status
    ) {
      id
      name
      description
      status
      startDate
      endDate
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const UPDATE_PROJECT_STATUS = gql`
  mutation UpdateProjectStatus($id: ID!, $status: String!) {
    updateProjectStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// User Queries and Mutations
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $username: String, $email: String, $role: String) {
    updateUser(id: $id, username: $username, email: $email, role: $role) {
      id
      username
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
