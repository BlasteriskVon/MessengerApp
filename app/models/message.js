module.exports = function(sequelize, Sequelize){
    var Message = sequelize.define("message", {
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
        },
        read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    Message.associate = function(models){
        Message.belongsTo(models.user, {
            foreignKey: {
                name: "sender_id",
                allowNull: false
            },
            as: "senderID",
            targetKey: "id"
        });
        //second one
        Message.belongsTo(models.user, {
            foreignKey: {
                name: "receiver_id",
                allowNull: false
            },
            as: "receiverID",
            targetKey: "id"
        });
        console.log(Message.associations);
    }

    return Message;
}