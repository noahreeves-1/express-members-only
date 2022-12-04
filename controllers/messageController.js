const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const user = require("../models/user");

exports.create_get = (req, res, next) => {
  res.render("message_form", {
    title: "Create Message",
    user: req.user,
  });
};

exports.create_post = [
  //validation
  body("message_title").trim().isLength({ min: 1 }).escape(),
  body("message_content").trim().isLength({ min: 1 }).escape(),
  // callback
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: req.body.message_title,
        message: req.body.message_content,
        user: req.user,
      });
    }

    const newMessage = new Message({
      title: req.body.message_title,
      timestamp: new Date(),
      text: req.body.message_content,
      user: req.user,
    });

    newMessage.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];

exports.delete_get = (req, res, next) => {
  res.render("delete_message", {
    user: req.user,
    title: "Are you sure you want to delete this message?",
  });
};

exports.delete_post = (req, res, next) => {
  Message.findById(req.params.id)
    .populate("user")
    .exec((err, message) => {
      if (err) {
        return next(err);
      }
      Message.findByIdAndRemove(message._id, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
};
