const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input validation
const validateRegisterInput = require("../../validation/register");

//load user model
const User = require("../../models/User"); // ../ = out of one folder

//@route    GET api/users/test
//@desc     Test user route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "User Works" }));

//@route    POST api/users/register
//@desc     Register user route
//@access   public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body); //pulls out the validation from req.body

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors); //return the erros json object
  }

  User.findOne({ email: req.body.email }) //with mongoose we can use promises or callbacks, I will use promise
    .then(user => {
      //user is returned
      if (user) {
        return res.status(400).json({ email: "Email already exists" }); //if user email already exists
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: 200, //size
          r: "pg", //rating
          d: "mm" //default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save() //returns promise
              .then(user => res.json(user)) //sends back successfull response with user in json format
              .catch(err => console.log(err));
          });
        });
      }
    });
});

//@route    POST api/users/login
//@desc     Login user / returning JWT token
//@access   public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by emal
  User.findOne({ email })
    .then(user => {
      //check for user
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      }

      //check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //User matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt payload

          //Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                succes: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res.status(400).json({ password: "Password incorrect" });
        }
      });
    })
    .catch();
});

//@route    GET api/users/current
//@desc     Return current user
//@access   private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }), //jwt is the strategy, makes this a private route
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
