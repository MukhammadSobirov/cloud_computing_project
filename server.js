//dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const d3 = require('d3');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStrore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const methodOverride = require("method-override");
const compress = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
import {creds} from './cred'
//

//mongoose configs
const MONGO_LOCAL = creds.mongodb;


mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
//

//mongoDB store configs
const store = new MongoDBStrore({
  uri: MONGO_LOCAL,
  collection: "sessions",
});
//

//DB collections
const User = require("./models/user");
//

//method-override configs
app.use(methodOverride("_method"));
//

//setting static folders
app.use(express.static(__dirname + "/public"));
//

//views configs
app.set("view engine", "ejs");
//

//body-parser config
app.use(bodyParser.urlencoded({ extended: true }));
//

//express session configs
app.use(
  session({
    secret: "alohamora",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//

//flash configs
app.use(flash());
//

//session middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    next(new Error(err));
  }
});
//

//Routes
const LandingRoute = require("./routes/landing");
const Auth = require("./routes/auth");
const Main = require("./routes/main");
const Income = require("./routes/entries");
const Stats = require("./routes/stats");
const error_contr = require("./controllers/error_C");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(compress())
app.use(morgan('combined', {stream: accessLogStream}))
//

//using Routes
app.use(LandingRoute);
app.use(Auth);
app.use(Main);
app.use(Income);
app.use(Stats);

app.get("/500", error_contr.get500);

app.use(error_contr.get404);

//express error handling middleware
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Page Not Found",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});


//port connection
const port = process.env.PORT || 8000;
mongoose
  .connect(MONGO_LOCAL)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
