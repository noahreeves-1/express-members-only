var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const user = require("../models/user");

/* HOME PAGE */
router.get("/", userController.index);

/* SIGN UP */
router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

/* LOG IN */
router.get("/log-in", userController.log_in_get);
router.post("/log-in", userController.log_in_post);

/* LOG OUT */
router.get("/log-out", userController.log_out_get);

/* MEMBERSHIP */
router.get("/join", userController.join_get);
router.post("/join", userController.join_post);

/* CREATE MESSAGE */
router.get("/create-message", messageController.create_get);
router.post("/create-message", messageController.create_post);

/* ADMIN */
router.get("/admin", userController.admin_get);
router.post("/admin", userController.admin_post);

/* DELETE MESSAGE */
router.get("/delete-message/:id", messageController.delete_get);
router.post("/delete-message/:id", messageController.delete_post);

module.exports = router;
