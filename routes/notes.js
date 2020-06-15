const express = require("express");
const router = express.Router();
const Notes = require("../models/notes");

const { ensureAuthenticated } = require("../helpers/auth");

//show notes page
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const response = await Notes.find({ user: req.user.id }).sort({
      date: "desc"
    });

    res.render("notes/show", { response });
  } catch (e) {}
});

//add notes page
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("notes/add");
});

//edit notes page
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Notes.findById(id);
    if (response.user !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/notes");
    }

    res.render("notes/edit", {
      id: response._id,
      title: response.title,
      body: response.body
    });
  } catch (e) {
    console.log("edit page error");
  }
});

//profile page
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("notes/profile", {
    user: req.user
  });
});

//add notes form
router.post("/add", ensureAuthenticated, async (req, res) => {
  try {
    let errors = [];
    if (!req.body.title) {
      errors.push({ text: "Please Add A Title" });
    }
    if (!req.body.body) {
      errors.push({ text: "Please Add Note Body" });
    }

    if (errors.length > 0) {
      return res.render("notes/add", {
        errors,
        title: req.body.title,
        body: req.body.body
      });
    }

    const newData = new Notes({
      title: req.body.title,
      body: req.body.body,
      user: req.user.id
    });
    await newData.save();
    req.flash("success_msg", "Note Added!");
    res.redirect("/notes");
  } catch (e) {
    console.log("error in adding notes");

    console.log(e);
  }
});

//edit notes form
router.put("/edit/:id", ensureAuthenticated, async (req, res) => {
  const _id = req.params.id;

  try {
    const response = await Notes.findOne({ _id });
    response.title = req.body.title;
    response.body = req.body.body;
    await response.save();
    req.flash("success_msg", "Note Updated!");
    res.redirect("/notes");
  } catch (e) {
    console.log(e);
  }
});

//delete note process
router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    const _id = req.params.id;
    await Notes.findOneAndDelete({ _id });
    req.flash("success_msg", "Note Deleted!");
    res.redirect("/notes");
  } catch (e) {
    console.log("error in delete note");
  }
});

module.exports = router;
