const express = require("express");
require("./db/mongoose");
const exphbs = require("express-handlebars");

const userRouter = require("./routes/user");
const notesRouter = require("./routes/notes");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const app = express();

const PORT = 3000 || process.env.PORT;

//handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//serve publicdir
app.use(express.static(path.join(__dirname, "/public")));

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
//flash middleware
app.use(flash());

//method override middleware
app.use(methodOverride("_method"));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// //express middlware
// app.use(function(req, res, next) {
//   console.log("Time:", Date.now());
//   res.send("site is under maintainance");
// next();
// });

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});

//routers
app.use("/user", userRouter);
app.use("/notes", notesRouter);

//passport config
require("./config/passport")(passport);

app.listen(PORT, () => {
  console.log(`server is up on ${PORT}`);
});
