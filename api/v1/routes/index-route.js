const taskRoutes = require("../routes/task-route");
const usersRoutes = require("../routes/users-route");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/tasks", taskRoutes);
  app.use(version + "/users", usersRoutes);
};
