const User = require("../models/user");
const Message = require("../models/message");

const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.index = (req, res, next) => {
  // get all messages and pass into "index" view
  Message.find()
    .populate("user")
    .exec((err, allMessages) => {
      if (err) {
        return next(err);
      }
      res.render("index", {
        user: req.user,
        allMessages,
      });
    });
};

// do I need this?
exports.log_in_get = (req, res, next) => {
  res.render("log_in", {
    title: "Log In",
    user: req.user,
    message: req.session.messages,
  });
};

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: "Username or password is incorrect",
});

exports.log_out_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.sign_up_get = (req, res, next) => {
  res.render("user_form", {
    title: "Create an Account",
  });
};

exports.sign_up_post = [
  body("first_name", "First Name must not be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("last_name", "Last Name must not be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("username", "Username must be at least 3 characters in length")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("email", "Please enter a valid email")
    .normalizeEmail()
    .isEmail()
    .trim()
    .isLength({ min: 9 })
    .escape(),
  body("password", "Please enter a valid password")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body("confirm_password", "Passwords must match")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords must match");
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("user_form", {
        title: "Create an Account",
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        errors: errors.array({ onlyFirstError: true }),
      });

      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      // Create new User object
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      // Save new User to MongoDB & show home page with SUCCESS message
      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.render("log_in", {
          title: "Log In",
          message: "User was created!",
        });
      });
    });
  },
];

exports.join_get = (req, res, next) => {
  res.render("membership", {
    user: req.user,
  });
};

exports.join_post = [
  // validation and sanitization
  body("secret_code").trim().equals("HELLO").escape(),
  // callback
  (req, res, next) => {
    const errors = validationResult(req);

    // errors in validation
    if (!errors.isEmpty()) {
      res.render("membership", {
        message: "Incorrect code. Say HELLO",
        user: req.user,
      });
      return;
    }
    User.findOneAndUpdate(
      { username: req.user.username },
      { membership_status: "true" },
      { new: true },
      (err, user) => {
        if (err) {
          return next(err);
        }
        Message.find()
          .populate("user")
          .exec((err, allMessages) => {
            if (err) {
              return next(err);
            }
            res.render("index", {
              user,
              allMessages,
            });
          });
      }
    );
  },
];

exports.admin_get = (req, res, next) => {
  res.render("admin_form", {
    user: req.user,
  });
};

exports.admin_post = [
  body("admin_code").trim().equals(process.env.admin_code).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("admin_form", {
        message:
          "Come on bro. You made this site. You should know the code... -,-",
      });
    }

    User.findOneAndUpdate(
      { username: req.user.username },
      { admin: "true" },
      { new: true },
      (err, user) => {
        if (err) {
          return next(err);
        }
        Message.find()
          .populate("user")
          .exec((err, allMessages) => {
            if (err) {
              return next(err);
            }
            res.render("index", {
              user,
              allMessages,
            });
          });
      }
    );
  },
];
