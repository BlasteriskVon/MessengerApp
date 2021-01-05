var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var env = require("dotenv").config();
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 5000;

//to access images
app.use(express.static("./app/views/images"));

//to access css
app.use(express.static("./app/views/assets"));

//for bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//for Passport
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//for handlebars
app.set("views", "./app/views");
app.engine("hbs", exphbs({
    extname: ".hbs",
    defaultLayout: false //so it won't look for the main.hbs
}));
app.set("view engine", ".hbs");

app.get("/", function(req, res){
    res.send("Welcome to the Messenger App!");
});

//Models
var models = require("./app/models");

//routes
var authRoute = require("./app/routes/auth.js")(app, passport);

//load passport strategies
require("./app/config/passport/passport.js")(passport, models.user);

//Sync Database
models.sequelize.sync().then(function(){
    console.log("Database is set Andrew-chan!");
}).catch(function(err){
    console.log(err, "Err, something went wrong with the database update!");
});

app.listen(PORT, function(err){
    if(!err){
        console.log("Site is up!");
    } else {
        console.log(err);
    }
})