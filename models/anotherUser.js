const anotherUser = (sequelize, DataTypes) => {
    const AnotherUser = sequelize.define('AnotherUser', {
        username: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
        },
    }, {});

    AnotherUser.associate = models => {
        AnotherUser.hasMany(models.Address);
    };


    return AnotherUser;
};

export default anotherUser;
