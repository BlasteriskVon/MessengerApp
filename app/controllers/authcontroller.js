var exports = module.exports = {};
exports.signup = function(req, res){
    res.render("signup", {
        error: req.flash("error")
    });
}
exports.signin = function(req, res){
    res.render("signin", {
        error: req.flash("error")
    });
}
exports.dashboard = function(req, res){
    res.render("dashboard");
}
exports.create = function(req, res){
    res.render("create");
}
exports.send = function(req, res){
    res.render("send");
}
exports.view = function(req, res){
    res.render("view");
}
exports.viewAll = function(req, res){
    res.render("view-all");
}
exports.messages = function(req, res){
    res.render("messages");
}
exports.change = function(req, res){
    res.render("change");
}
exports.logout = function(req, res){
    req.session.destroy(function(err){
        res.redirect("/signin");
    })
}
