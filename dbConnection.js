let mongoose = require("mongoose");
//add bcryptjs
let bcrypt = require("bcryptjs");
//add json web token module in app
let jsonWebTokenMo = require("jsonwebtoken");
mongoose.set("strictQuery", true);
mongoose.set("debug", true);
mongoose
  .connect(
    "mongodb+srv://rasheed:Cprogramming123%40@project2.yooau.mongodb.net/App1"
  )
  .then(() => console.log("database connected"))
  .catch((e) => console.log("failed to connect with database", e));
//create schema for user signup data
let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//use the pre() before the data added in database
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 11);
  }
  next();
});
//generate token;
//send token here in schema
userSchema.methods.tokenGen = async function () {
  try {
    //generate token
    let token = jsonWebTokenMo.sign(
      { _id: this.id.toString() },
      "fkdasdsfjksafsajfsdfasdfksldf"
    );
    this.tokens = this.tokens.concat({ token: token });
    return token;
  } catch (error) {
    console.log(error);
  }
};
//create model of database
let user = mongoose.model("users", userSchema);
//export user to use it outside
module.exports = user;
