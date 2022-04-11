const config = require("../config/auth.config");
const db = require("../models");
const nodemailer = require('nodemailer')
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

exports.signup = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kpi.esprit@gmail.com',
      pass: '28108355'}
    });
    const tempPassword = makeid(8);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    cin: req.body.cin,
    salary: req.body.salary,
    type: req.body.type,
    password: bcrypt.hashSync(tempPassword, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          const mailOptions = {
            from: 'School administration',
            to: user.email,
            subject: 'Welcome to our platform',
            text: "This is your password: " + tempPassword
            };
            transporter.sendMail(mailOptions)

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
  
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.forget = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kpi.esprit@gmail.com',
      pass: '28108355'}
    });

  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const tempPassword = makeid(8);
      user.password = bcrypt.hashSync(tempPassword, 8);
      user.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        const mailOptions = {
          from: 'School administration',
          to: user.email,
          subject: 'Password reset demand',
          text: "This is your temporary password: " + tempPassword
          };
          transporter.sendMail(mailOptions)

        res.send({ message: "Temporary password successfullly sent!" });
      });
    });
};

exports.reset = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kpi.esprit@gmail.com',
      pass: '28108355'}
    });

  User.findOne({
    email: req.body.email,
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "USER NOT FOUND" });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.currentPassword,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Current Password!"
        });
      } else {
        user.password = bcrypt.hashSync(req.body.newPassword, 8);
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Password successfully reset! " });
        });
      }
      
    });
};
