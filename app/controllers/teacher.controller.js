const config = require("../config/auth.config");
const db = require("../models");
const Subject = db.subject;
const User = db.user;

exports.addSubjectToTeacher = async (req, res) => {
  
    const teacherId= req.body.teacherId;
    const subjectId= req.body.subjectId;
    const fetchedSubject = await Subject.findOne({_id: subjectId},
        async (err, subject) => {
            const fetchedTeacher = await User.findOne({_id: teacherId},
                async (err, teacher) => {
                    console.log(teacher._id)
                    //console.log(subject.teachers);
                    for(let teach of subject.teachers) {
                      console.log(teach._id.toString() );
                      
                      if(teacher._id.toString() == teach.toString()) {
                        return res.status(409).send({ message: 'subject already added' });
                      }
                    }
                   
                    subject.teachers.push(teacher);
                    await subject.save(async (err, subject) => {
                      for(let subj of teacher.subjects) {
                        if(subject._id.toString() == subj.toString()) {
                          return res.status(409).send({ message: 'subject already added !' });
                        }
                      }

                        if (err) {
                         // res.status(500).send({ message: err });
                          return;
                        }
                        teacher.subjects.push(subject);
                        await teacher.save((err, teacher) => {
                          console.log(teacher)
                            if (err) {
                              res.status(500).send({ message: err });
                              return;
                            }
                            res.send('hhhh')
                          });
                      });

                    
                    
                    
                }
                );
        });
        
};

exports.removeSubjectFromTeacher = async (req, res) => {
  
  const teacherId= req.body.teacherId;
  const subjectId= req.body.subjectId;
  const fetchedSubject = await Subject.findOne({_id: subjectId},
      async (err, subject) => {
          const fetchedTeacher = await User.findOne({_id: teacherId},
              async (err, teacher) => {
                  console.log(teacher._id)
                  //console.log(subject.teachers);
                 // subject.teachers.id(teacherId).remove();
                  subject.teachers.pull(teacherId)
               
                  await subject.save(async (err, subject) => {
                    teacher.subjects.pull(subjectId)
                  

                      if (err) {
                       // res.status(500).send({ message: err });
                        return;
                      }
                      await teacher.save((err, teacher) => {
                        console.log(teacher)
                          if (err) {
                            res.status(500).send({ message: err });
                            return;
                          }
                          res.send('hhhh')
                        });
                    });

                  
                  
                  
              }
              );
      });
      
};

exports.getTeacherById = (req, res) => {
  
  const teacherId = req.body.teacherId;
  User.findOne({_id: teacherId},
      (err, teacher) => {
        res.send(teacher)
      });
};


