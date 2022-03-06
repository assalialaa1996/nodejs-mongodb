const config = require("../config/auth.config");
const db = require("../models");
const Subject = db.subject;
const User = db.user;

exports.addSubjectToTeacher = (req, res) => {
  
    const teacherId= req.body.teacherId;
    const subjectId= req.body.subjectId;
    const fetchedSubject = Subject.findOne({_id: subjectId},
        (err, subject) => {
            const fetchedTeacher = User.findOne({_id: teacherId},
                (err, teacher) => {
                    console.log(teacher)
                    
                    subject.teachers.push(teacher)
                    subject.save((err, subject) => {
                        if (err) {
                         // res.status(500).send({ message: err });
                          return;
                        }
                        teacher.subjects.push(subject);
                        teacher.save((err, teacher) => {
                            if (err) {
                              res.status(500).send({ message: err });
                              return;
                            }
                          });
                      });

                    
                    
                    
                }
                );
        });
        res.send('3asba')
};


