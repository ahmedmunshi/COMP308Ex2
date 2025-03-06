// resolvers.js
const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const { authenticate, isAuthenticated, isAdmin, isAdminOrSelf } = require("../middleware/auth");
const config = require("../config/config");

// Helper function to format document with ID
const formatDocument = (doc) => {
  if (!doc) return null;

  const obj = doc.toObject();

  // Format dates properly
  if (obj.startDate) obj.startDate = obj.startDate.toISOString();
  if (obj.endDate) obj.endDate = obj.endDate.toISOString();
  if (obj.createdDate) obj.createdDate = obj.createdDate.toISOString();
  if (obj.createdAt) obj.createdAt = obj.createdAt.toISOString();

  return {
    id: doc._id.toString(),
    ...obj,
  };
};

// Helper function to format documents with populated fields
const formatPopulatedDocument = (doc, populatedFields = {}) => {
  if (!doc) return null;

  const obj = doc.toObject();

  // Format dates properly
  if (obj.startDate) obj.startDate = obj.startDate.toISOString();
  if (obj.endDate) obj.endDate = obj.endDate.toISOString();
  if (obj.createdDate) obj.createdDate = obj.createdDate.toISOString();
  if (obj.createdAt) obj.createdAt = obj.createdAt.toISOString();

  const formatted = {
    id: doc._id.toString(),
    ...obj,
  };

  // Format any populated fields
  Object.entries(populatedFields).forEach(([field, subFields]) => {
    if (Array.isArray(doc[field])) {
      formatted[field] = doc[field].map((item) => formatDocument(item));
    } else if (doc[field]) {
      formatted[field] = formatDocument(doc[field]);

      // Handle nested populated fields
      if (subFields && doc[field][subFields]) {
        if (Array.isArray(doc[field][subFields])) {
          formatted[field][subFields] = doc[field][subFields].map((item) => formatDocument(item));
        } else {
          formatted[field][subFields] = formatDocument(doc[field][subFields]);
        }
      }
    }
  });

  return formatted;
};

const resolvers = {
  Query: {
    // User queries
    me: async (_, __, { req }) => {
      const user = await authenticate(req);
      isAuthenticated(user);
      return formatDocument(user);
    },

    users: async (_, __, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);
      const users = await User.find();
      return users.map((user) => formatDocument(user));
    },

    user: async (_, { id }, { req }) => {
      const authUser = await authenticate(req);
      isAdminOrSelf(authUser, id);
      const user = await User.findById(id);
      return formatDocument(user);
    },

    // Team queries
    teams: async () => {
      const teams = await Team.find().populate("members");
      return teams.map((team) => formatPopulatedDocument(team, { members: null }));
    },

    team: async (_, { id }) => {
      const team = await Team.findById(id).populate("members");
      return formatPopulatedDocument(team, { members: null });
    },

    teamsByMember: async (_, { userId }) => {
      const teams = await Team.find({ members: userId }).populate("members");
      return teams.map((team) => formatPopulatedDocument(team, { members: null }));
    },

    // Project queries
    projects: async () => {
      const projects = await Project.find().populate({
        path: "team",
        populate: { path: "members" },
      });
      return projects.map((project) => formatPopulatedDocument(project, { team: "members" }));
    },

    project: async (_, { id }) => {
      const project = await Project.findById(id).populate({
        path: "team",
        populate: { path: "members" },
      });
      return formatPopulatedDocument(project, { team: "members" });
    },

    projectsByTeam: async (_, { teamId }) => {
      const projects = await Project.find({ team: teamId }).populate({
        path: "team",
        populate: { path: "members" },
      });
      return projects.map((project) => formatPopulatedDocument(project, { team: "members" }));
    },
  },

  Mutation: {
    // Auth mutations
    register: async (_, { username, email, password, role }, { res }) => {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        role: role || "Member",
      });

      // Create token
      const token = user.getSignedJwtToken();

      // Set cookie if we have res context
      if (res) {
        res.cookie("token", token, {
          expires: new Date(Date.now() + config.cookieExpire * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }

      return {
        token,
        user: formatDocument(user),
      };
    },

    login: async (_, { email, password }, { res }) => {
      // Check for user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // Create token
      const token = user.getSignedJwtToken();

      // Set cookie if we have res context
      if (res) {
        res.cookie("token", token, {
          expires: new Date(Date.now() + config.cookieExpire * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }

      return {
        token,
        user: formatDocument(user),
      };
    },

    logout: async (_, __, { res }) => {
      if (res) {
        res.cookie("token", "none", {
          expires: new Date(Date.now() + 10 * 1000),
          httpOnly: true,
        });
      }
      return true;
    },

    // User mutations
    updateUser: async (_, args, { req }) => {
      const authUser = await authenticate(req);
      isAdminOrSelf(authUser, args.id);

      const user = await User.findByIdAndUpdate(args.id, args, { new: true });
      return formatDocument(user);
    },

    deleteUser: async (_, { id }, { req }) => {
      const authUser = await authenticate(req);
      isAdmin(authUser);

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Also remove user from teams
      await Team.updateMany({ members: id }, { $pull: { members: id } });
      return true;
    },

    // Team mutations
    createTeam: async (_, args, { req }) => {
      try {
        const user = await authenticate(req);
        isAdmin(user);

        console.log("Creating team with args:", args);

        const team = await Team.create(args);
        console.log("Team created:", team);

        const populatedTeam = await Team.findById(team._id).populate("members");
        return formatPopulatedDocument(populatedTeam, { members: null });
      } catch (error) {
        console.error("Error in createTeam:", error.message);
        throw new Error(`Failed to create team: ${error.message}`);
      }
    },

    updateTeam: async (_, args, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      const team = await Team.findByIdAndUpdate(args.id, args, { new: true }).populate("members");
      return formatPopulatedDocument(team, { members: null });
    },

    deleteTeam: async (_, { id }, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      const team = await Team.findByIdAndDelete(id);
      if (!team) {
        throw new Error(`Team with ID ${id} not found`);
      }

      // Also delete all projects associated with this team
      await Project.deleteMany({ team: id });
      return true;
    },

    addMemberToTeam: async (_, { teamId, userId }, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      const team = await Team.findByIdAndUpdate(teamId, { $addToSet: { members: userId } }, { new: true }).populate(
        "members"
      );

      return formatPopulatedDocument(team, { members: null });
    },

    removeMemberFromTeam: async (_, { teamId, userId }, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      const team = await Team.findByIdAndUpdate(teamId, { $pull: { members: userId } }, { new: true }).populate(
        "members"
      );

      return formatPopulatedDocument(team, { members: null });
    },

    // Project mutations
    createProject: async (_, args, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      const { teamId, ...projectData } = args;
      const project = await Project.create({
        ...projectData,
        team: teamId,
      });

      const populatedProject = await Project.findById(project._id).populate({
        path: "team",
        populate: { path: "members" },
      });

      return formatPopulatedDocument(populatedProject, { team: "members" });
    },

    updateProject: async (_, args, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      let updateData = { ...args };
      if (args.teamId) {
        updateData.team = args.teamId;
        delete updateData.teamId;
      }

      const project = await Project.findByIdAndUpdate(args.id, updateData, { new: true }).populate({
        path: "team",
        populate: { path: "members" },
      });

      return formatPopulatedDocument(project, { team: "members" });
    },

    deleteProject: async (_, { id }, { req }) => {
      const user = await authenticate(req);
      isAdmin(user);

      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        throw new Error(`Project with ID ${id} not found`);
      }

      return true;
    },

    updateProjectStatus: async (_, { id, status }, { req }) => {
      const user = await authenticate(req);
      isAuthenticated(user);

      // Check if user is admin or a member of the project's team
      const project = await Project.findById(id).populate("team");
      if (!project) {
        throw new Error(`Project with ID ${id} not found`);
      }

      if (user.role !== "Admin") {
        const team = await Team.findById(project.team._id);
        if (!team.members.some((memberId) => memberId.toString() === user._id.toString())) {
          throw new Error("Not authorized");
        }
      }

      const updatedProject = await Project.findByIdAndUpdate(id, { status }, { new: true }).populate({
        path: "team",
        populate: { path: "members" },
      });

      return formatPopulatedDocument(updatedProject, { team: "members" });
    },
  },
};

module.exports = resolvers;
