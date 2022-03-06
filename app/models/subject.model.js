const mongoose = require("mongoose");

const Subject = mongoose.model(
  "Subject",
  new mongoose.Schema({
      name: {
        required: true,
        type: String
      },
      nbHeures: {
        required: true,
        type: Number
    },
      ects: {
        required: true,
        type: Number
    },
      teachers: 
      [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
      ]
  })
);

module.exports = Subject;
