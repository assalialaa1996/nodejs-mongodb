const controller = require("../controllers/teacher.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.put(
    "/api/teachers/add",
    controller.addSubjectToTeacher
  );

  app.put(
    "/api/teachers/remove",
    controller.removeSubjectFromTeacher
  );

};
