const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");

const authController = require("../controllers/auth_C");

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body(
      "password",
      "Password has to be at least 5 characters. Only numbers and letters are allowed"
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email").isEmail(),
    // .withMessage('Please enter a valid email.'),
    // .custom((value, { req }) => {

    //      User.findOne({ email: value }).then(userDoc => {
    //         if (userDoc) {
    //             return Promise.reject(
    //                 'E-Mail exists already, please pick a different one.'
    //             );
    //         }
    //     });
    // })
    // .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);
module.exports = router;
