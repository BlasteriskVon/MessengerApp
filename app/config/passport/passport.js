var bCrypt = require("bcrypt-nodejs");
module.exports = function(passport, user){
    var User = user;
    var LocalStrategy = require("passport-local").Strategy;

    //serialize
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    //deserialize
    passport.deserializeUser(function(id, done){
        User.findByPk(id).then(function(user){
            if(user){
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    //local signup
    passport.use("local-signup", new LocalStrategy(
        {
            usernameField: "username", //this should be the default but just in case
            passwordField: "password",
            passReqToCallback: true //ooooh i think this is what lets the later function use req
        },
        function(req, username, password, done){
            console.log(req.body); //just so i can see it and make sure its the same req from the previous route
            var generateHash = function(password){
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: {
                    username: username
                }
            }).then(function(user){
                if(user){
                    console.log("username taken");
                    return done(null, false, {
                        message: "That username is already taken!"
                    });
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        username: username,
                        password: userPassword,
                    }
                    if(req.body.picture && req.body.picture.length >= 5){
                        data.picture = req.body.picture;
                    }
                    User.create(data).then(function(newUser, created){
                        if(!newUser){
                            console.log("idk, something");
                            return done(null, false);
                        }
                        if(newUser){
                            console.log("user created");
                            return done(null, newUser);
                        }
                    })
                }
            })
        }
    ));

    //local signin
    passport.use("local-signin", new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        },

        function(req, username, password, done){
            var User = user;
            var isValidPassword = function(userpass, password){
                return bCrypt.compareSync(password, userpass);
            }

            User.findOne({
                where: {
                    username: username
                }
            }).then(function(user){
                if(!user){
                    return done(null, false, {
                        message: "Username does not exist"
                    });
                }
                if(!isValidPassword(user.password, password)){
                    return done(null, false, {
                        message: "Incorrect password."
                    });
                }
                var userinfo = user.get();
                if(req.body.remember){
                    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                    req.session.cookie.expires = false;
                }
                return done(null, userinfo);
            }).catch(function(err){
                console.log("Error:", err);

                return done(null, false, {
                    message: "Something went wrong with your Signin"
                })
            })
        }
    ))
}