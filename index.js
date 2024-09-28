let express = require("express");
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let router = require("./router.js");
app.set("view engine", "ejs");
app.use(router);
app.use(express.static("public"));
app.listen(3000, () => {
  console.log("connection created");
});
