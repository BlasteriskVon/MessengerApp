var exports = module.exports = {};
exports.signup = function(req, res){
    res.render("signup");
}
exports.signin = function(req, res){
    res.render("signin");
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
exports.logout = function(req, res){
    req.session.destroy(function(err){
        res.redirect("/signin");
    })
}
