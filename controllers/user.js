const User = require("../model/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("includes/users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("includes/users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcomeback to Wanderlust!!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);

  // res.redirect(res.locals.redirectUrl || "/listings");
};



module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!!");
    res.redirect("/listings");
  });
};
 