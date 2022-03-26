const controller = require("../controllers/teacher.controller");
const { authJwt } = require("../middlewares");

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
    [authJwt.verifyToken],
    controller.addSubjectToTeacher
  );

  app.put(
    "/api/teachers/remove",
    [authJwt.verifyToken],
    controller.removeSubjectFromTeacher
  );

  app.get(
    "/api/teachers",
    [authJwt.verifyToken],
    controller.getTeacherById
  );

};
