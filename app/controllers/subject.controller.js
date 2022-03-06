const config = require("../config/auth.config");
const db = require("../models");
const Subject = db.subject;

exports.createSubject = (req, res) => {
  const subject = new Subject({
    name: req.body.name,
    nbHeures: req.body.nbHeures,
    ects: req.body.ects,

  });

  subject.save((err, subject) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Subject was registered successfully!" });
  });
};

exports.getSubjectById = (req, res) => {
  
  const subjectId= req.body.subjectId;
  Subject.findOne({_id: subjectId},
      (err, subject) => {
        res.send(subject)
      });
};

