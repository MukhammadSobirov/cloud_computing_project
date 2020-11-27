const User = require("../models/user");
const Wallet = require("../models/wallet");
const Income = require("../models/income");
const Expense = require("../models/expense");
const Notes = require("../models/notes");


//*Notes and ideas *//
//*Get notes*//
exports.getNotes = async (req, res, next) => {
    const user_id = req.params.user_id;
    try {
      const user = await User.findById(user_id).populate("notes");
      res.render("main_notes", {
        pageTitle: "Notes and Ideas",
        user: user,
        user_id: user_id,
        notes: user.notes,
      });
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  };
  //*Post notes*//
  exports.postNotes = async (req, res, next) => {
    const user_id = req.params.user_id;
    try {
      const user = await User.findById(user_id);
      const note = await Notes.create(req.body.notes);
      await user.notes.push(note);
      await user.save();
      console.log(note);
      res.redirect(`/main/${user_id}/notes`);
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  };
  
  //*Edit Notes*//
  exports.updateNotes = async (req, res, next) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    try {
      const note = await Notes.findByIdAndUpdate(note_id, req.body.notes);
      res.redirect(`/main/${user_id}/notes`);
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  };
  
  //*Destroy Notes*//
  exports.deleteNote = async (req, res, next) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    try {
      const note = await Notes.findByIdAndRemove(note_id);
      res.redirect(`/main/${user_id}/notes`);
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  };