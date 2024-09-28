let express = require("express");
let router = express.Router();
let path = require("path");
let user = require("./dbConnection.js");
//import bcryptjs module
let bcrypt = require("bcryptjs");
let jsonWebToken = require("jsonwebtoken");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
//check user is login or not
let auth = false;
//fetch views directory
let viewsDirec = path.join(__dirname, "views");
//sign up user and save data in database
router.post("/adduser", async (req, res) => {
  try {
    let data = req.body;
    if (!(req.body.password === req.body.confirmPassword)) {
      res.send("Password not match");
      return;
    }
    //check if email already not exist
    let findEmail = await user.findOne({ email: data.email });
    if (findEmail) {
      res.send("Email exist");
      return;
    }
    //destructuring object
    let { password, username, email, confirmPassword, tokens } = req.body;
    //add these sign up data to database
    let addData = new user({
      username,
      email,
      password,
      confirmPassword,
      tokens,
    });
    //get token
    let token = await addData.tokenGen();
    //save these data
    let result = await addData.save();
    res.cookie("firstCookie", token);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});
//show login page
router.get("/login", (req, res) => {
  //using ejs to response render()
  res.render(viewsDirec + "/login");
});
//check user login data
router.post("/loginuser", async (req, res) => {
  try {
    let { email, password } = req.body;
    let data = await user.findOne({
      email: email,
    });
    //check data exist and entered password db_store password are equal so execute it home page other wise login page
    if (data && bcrypt.compareSync(password, data.password)) {
      auth = true;
      //generate token at login time
      let tokn = await data.tokenGen();
      res.cookie("testCookie", tokn);
      await data.save();
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});
//authenticate page
router.get("/authenticate", async (req, res) => {
  try {
    let token = req.cookies.firstCookie;
    const bodyParser = require("body-parser");
    let verifyTokn = jsonWebToken.verify(
      token,
      "fkdasdsfjksafsajfsdfasdfksldf"
    );

    if (verifyTokn) {
      let data = await user.findOne({ _id: verifyTokn._id });
      res.send(data);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
//logout user route
router.get("/logout", (req, res) => {
  try {
    if (auth) {
      auth = false;
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});
//router get request
router.get("/", (req, res) => {
  res.render(viewsDirec + "/index");
});
module.exports = router;
