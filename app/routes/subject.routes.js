const controller = require("../controllers/subject.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/subjects",
    [authJwt.verifyToken],
    controller.createSubject
  );

  app.get(
    "/api/subjects",
    [authJwt.verifyToken],
    controller.getSubjectById
  );

};
