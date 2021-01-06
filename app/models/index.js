"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config;
if(env === "development"){
    config = require(path.join(__dirname, '../../', 'config', 'config.json'))[env]; //initially the second argument was .. but that was app/config and led to errors
} else {
    config = require(path.join(__dirname, '../../', 'config', 'production.json'))[env];
}
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};
 
 
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); //sequelize.import(path.join(__dirname, file)) was the original but it didnt work
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) { //initially was if("associate" in db[modelName]) but wasn't detected to changed it
    //console.log(db)
        db[modelName].associate(db);
    }
});
 
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;