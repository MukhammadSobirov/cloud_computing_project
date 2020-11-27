const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notesSchema = new Schema(
  {
    title: { type: String, default: "Untitled" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notes", notesSchema);
