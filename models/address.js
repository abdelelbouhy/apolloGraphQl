const address = (sequelize, DataTypes) => {
    const Address = sequelize.define('address', {
        street: {
            type: DataTypes.STRING,
        },
    });

    Address.associate = models => {
        Address.belongsTo(models.User);
    };

    return Address;
};

export default address;