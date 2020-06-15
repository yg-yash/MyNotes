const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

const notes = mongoose.model("notes", NotesSchema);
module.exports = notes;
