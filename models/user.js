const user = (sequelize, DataTypes) => {
    const TestUser = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
        },
    });

    TestUser.associate = models => {
        TestUser.hasMany(models.Address, { onDelete: 'CASCADE' });
    };

    TestUser.findByLogin = async login => {
        let user = await TestUser.findOne({
            where: { username: login },
        });

        if (!user) {
            user = await TestUser.findOne({
                where: { email: login },
            });
        }

        return user;
    };


    return TestUser;
};

export default user;
