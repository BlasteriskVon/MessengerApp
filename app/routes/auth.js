const { json } = require("body-parser");
const { authorize } = require("passport");
var authController = require("../controllers/authcontroller.js");
var models = require("../models");
const message = require("../models/message.js");
var User = models.user;
var Post = models.post;
var Message = models.message;

module.exports = function(app, passport){
    app.get("/", isLoggedIn, authController.dashboard);
    app.get("/signup", notLoggedIn, authController.signup);
    app.get("/signin", notLoggedIn, authController.signin);
    app.get("/create", isLoggedIn, authController.create);
    app.get("/view", isLoggedIn, authController.view);
    app.get("/view-all", isLoggedIn, authController.viewAll);
    app.get("/send", isLoggedIn, authController.send);
    app.get("/messages", isLoggedIn, authController.messages);
    app.post("/signup", passport.authenticate("local-signup", {
            successRedirect: "/dashboard",
            failureRedirect: "/signup",
            badRequestMessage: "testing",
            failureFlash: true
        }
    ));
    app.post("/signin", passport.authenticate("local-signin", {
            successRedirect: "/dashboard",
            failureRedirect: "/signin",
            badRequestMessage: "testing",
            failureFlash: true
        }
    ));
    app.get("/dashboard", isLoggedIn, authController.dashboard);
    app.get("/logout", authController.logout);
    app.get("/user/:userid?", getUser);
    app.get("/users", getAllUsers);
    app.post("/create", createPost);
    app.post("/send", sendMessage);
    app.post("/posts/user", getPosts);
    app.get("/post/:id", getPost);
    app.post("/messages", getMessages);
    app.get("/posts/all", getAllPosts);
    app.post("/read", readMessage);
    app.post("/check", checkMessages);

    app.delete("/posts/:id", deletePost);
    app.put("/posts", updatePost);

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/signin");
    }
    function notLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect("/dashboard");
    }
    function getUser(req, res){
        if(req.isAuthenticated()){
            return res.json(req.user);
        }
    }
    function getAllUsers(req, res){
        User.findAll().then(function(dbUser){
            res.json(dbUser);
        }).catch(function(err){
            console.log(err);
        })
    }
    function checkMessages(req, res){
        User.update({
            received_message: false
        }, {
            where: {
                id: req.body.id
            }
        }).then(function(result){
            res.json(result);
        })
    }
    function messageSent(req, res){
        User.update({
            received_message: true
        }, {
            where: {
                id: req.body.receiver_id
            }
        }).then(function(result){
            res.json(result)
        })
    }
    function createPost(req, res){
        Post.create(req.body).then(function(dbPost){
            res.json(dbPost);
        });
    }
    function sendMessage(req, res){
        Message.create(req.body).then(function(dbMessage){
            messageSent(req, res);
        })
    }
    function getPosts(req, res){
        console.log("calling getposts");
        console.log(Post.associations);
        console.log(req.body);
        Post.findAll({
            include: [{
                association: "user",
                where: {
                    id: req.body.userId
                }
            }]
        }).then(function(dbPost){
            res.json(dbPost);
        }).catch(function(err){
            console.log("Error:", err);
        })
    }
    function getPost(req, res){
        Post.findAll({
            where: {
                id: req.params.id
            }
        }).then(function(result){
            res.json(result);
        })
    }
    function getMessages(req, res){
        console.log("calling getmessages");
        console.log(Message.associations);
        Message.findAll({
            include: [{
                association: "receiverID",
                where: {
                    id: req.body.userId
                }
            },
            {
                association: "senderID"
            }]
        }).then(function(dbMessage){
            res.json(dbMessage);
        }).catch(function(err){
            console.log(err);
        })
    }
    function getAllPosts(req, res){
        console.log("calling getposts");
        console.log(Post.associations);
        Post.findAll({
            include: [{
                association: "user",
            }]
        }).then(function(dbPost){
            res.json(dbPost);
        }).catch(function(err){
            console.log("Error:", err);
        })
    }
    function deletePost(req, res){
        Post.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbPost){
            res.json(dbPost);
        })
    }
    function updatePost(req, res){
        Post.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
        }).then(function(dbPost){
            res.json(dbPost);
        })
    }
    function readMessage(req, res){
        Message.update({
            read: req.body.read
        }, {
            where: {
                id: req.body.id
            }
        }).then(function(result){
            getMessage(req, res);
        })
    }
    function getMessage(req, res){
        Message.findAll({
            where: {
                id: req.body.id
            },
            include: [{
                association: "receiverID",
            },
            {
                association: "senderID"
            }]
        }).then(function(result){
            res.json(result);
        })
    }
}