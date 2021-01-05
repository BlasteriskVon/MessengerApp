module.exports = function(sequelize, Sequelize){
    var User = sequelize.define("user", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        received_message: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        picture: {
            type: Sequelize.STRING,
            defaultValue: "https://ih1.redbubble.net/image.757796448.0920/flat,750x1000,075,f.u3.jpg"
        }
    });

    User.associate = function(models){
        User.hasMany(models.post, {
            as: "post",
            onDelete: "cascade"
        });
        console.log(User.associations);
    }
    return User;
}