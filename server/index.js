const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const cors = require("cors");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const sessionStore = new SequelizeStore({ db });
const port = process.env.PORT || 8080;
const app = express();

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// logging middleware
app.use(morgan("dev"));

//Connect/Express middleware
// app.use(cors());

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// compression middleware
app.use(compression());

// session middleware with passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "my best friend is Cody",
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// auth and api routes
app.use("/auth", require("./auth"));
app.use("/api", require("./api"));

// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "public")));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

app.listen(port, () => console.log(`Web service running on port ${port}`));
