module.exports = function(sequelize, Sequelize){
    var Post = sequelize.define("post", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: false,
            len: [1]
        }
    });

    Post.associate = function(models){
        Post.belongsTo(models.user, {
            foreignKey: {
                allowNull: false
            },
            as: "user",
            targetKey: "id"
        });
        console.log("Associations", Post.associations);
    }

    return Post;
}