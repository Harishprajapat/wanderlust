if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
// const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./model/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_URL;

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");
const userRoute = require("./routes/user.js");

main()
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

console.log("DB URL:", dbUrl);

//ejs set up
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   collectionName: "sessions",
//   crypto: {
//     secret: "mysecretcode",
//   },
//   touchAfter: 24 * 3600,
// });

// store.on("error", (err) => {
//   console.log("SESSION STORE ERROR", err);
// });

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("errors");
  res.locals.currUser = req.user;
  res.locals.redirectUrl = req.session.redirectUrl || "/listings";
  next();
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", userRoute);

// app.get("/", (req, res) => {
//   res.send("Hi , ia m root");
// });

app.use("/api", (req, res, next) => {
  let { token } = req.query;
  if (token === "giveacess") {
    return next();
  }
  res.send("ACCESS DENIED");
});

app.get("/api", (req, res) => {
  res.send("data");
});

app.use((req, res, next) => {
  console.log("❌ Route not found:", req.method, req.originalUrl);
  next();
});

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  // If headers are already sent, delegate to the default Express error handler
  if (res.headersSent) {
    console.error("Headers already sent when handling error:", err);
    return next(err);
  }
  const { statusCode = 500, message = "something went wrong" } = err;
  console.error(err);
  res.status(statusCode).render("error.ejs", { message, statusCode, err });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
