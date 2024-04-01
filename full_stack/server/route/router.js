const express = require("express"); //Importing express module
const router = express.Router();
const { loginverify, signinverify, getprofile, postlogin, postsignin } = require('../controller/authcontroller');

router.post("/login", loginverify, postlogin);
router.post("/signup", signinverify, postsignin);
router.get("/profile", getprofile);

//Exporting router module
module.exports = router;