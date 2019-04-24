const address = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        street: {
            type: DataTypes.STRING,
        },
        road: {
            type: DataTypes.STRING,
        },
    }, {});

    Address.associate = models => {
        Address.belongsTo(models.User);
    };

    return Address;
};

export default address;

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//
//     const Attribute = sequelize.define('Attribute', {
//         key: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         value: DataTypes.STRING
//     }, { });
//
//     Attribute.associate = function (models) {
//         Attribute.belongsTo(models.Product);
//     };
//
//     // extensions to replace or extend existing graphql implementations (available options would be create, destroy, update, query)
//     Attribute.graphql = {
//         before: {
//             fetch: (source, args, context, info) => {
//                 return Promise.resolve(source);
//             }
//         },
//         extend: {
//             fetch: (data, source, args, context, info) => {
//                 data.key = "Added by extension.";
//                 return Promise.resolve(data);
//             }
//         }
//     };
//
//     return Attribute;
//
// };
