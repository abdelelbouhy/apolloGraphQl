import express from 'express';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import { mergeTypes } from 'merge-graphql-schemas';
import { merge } from "lodash";
// import models, {sequelize} from '../models';
const app = express();


const userSchema = gql`
  type Query {
    user(id: Int!): User
    users: [User!]
    me: User
    addresses: [Address]
  }

  type User {
    username: String!
    country: String!
    age: Int!
    addresses: [Address]
  }
  
   type Mutation {
     createUser(
      username: String!
      age: Int!
    ): ID!
  }

  type Token {
    token: String!
  }
`;

const addressSchema = gql`
  type Query {
    address: Address
  }

  type Address {
    street: String!
    house: String!
    road: String!
    user: User!
  }
  
  type Mutation {
    createAddress(text: String!): Address!
    deleteAddress(id: ID!): Boolean!
  }
`;

const schema = mergeTypes([userSchema, addressSchema], { all: true });

const uerResolver = {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findByPk(id);
        },
        me: async (parent, args, { models, me }) => {
            return await models.User.findByPk(me.id);
        },
    },

    User: {
        addresses: async (user, args, { models }) => {
            return await models.Address.findAll({
                where: {
                    userId: user.id,
                },
            });
        },
    },

    Mutation: {
        createUser: async (parent, { username, age }, { me, models }) => {
            return await models.User.create({
                username,
                age,
            }).then((user) => {
                return user.get({
                    plain: true
                }).id
            });
        },
        //
        // deleteUser: async (parent, { id }, { models }) => {
        //     return await models.User.destroy({ where: { id } });
        // },
    },
};

const addressResolver = {
    Query: {
        addresses: async (parent, args, { models }) => {
            return await models.Address.findAll();
        },
        address: async (parent, { id }, { models }) => {
            return await models.Address.findByPk(id);
        },
    },

    Mutation: {
        createAddress: async (parent, { text }, { me, models }) => {
            return await models.Address.create({
                text,
                userId: me.id,
            });
        },

        deleteAddress: async (parent, { id }, { models }) => {
            return await models.Address.destroy({ where: { id } });
        },
    },

    Address: {
        user: async (address, args, { models }) => {
            return await models.User.findByPk(address.userId);
        },
    },
};

// const resolvers = merge({}, uerResolver, addressResolver);

const server = new ApolloServer({
    typeDefs: schema,
    uerResolver,
    // context: { // connect sequelize to schema
    //     models,
    // },
});

const createUsersWithAddresss = async () => {
    await models.User.create(
        {
            username: 'abdel',
            age: 25,
            addresses: [
                {
                    street: 'Abdel street',
                },
            ],
        },
        {
            include: [models.Address],
        },
    );

    await models.User.create(
        {
            username: 'elbouhy',
            age: 35,
            addresses: [
                {
                    street: 'elbouhy street',
                },
                {
                    street: 'elbouhy street 2 ...',
                },
            ],
        },
        {
            include: [models.Address],
        },
    );
};

server.applyMiddleware({ app, path: '/graphql' });
app
    .set('view engine', 'ejs')
    .set('views', path.resolve(__dirname, '../views'))
    .use('/dist', express.static(path.resolve(__dirname, '../dist/')));

app.listen({ port: 80 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});

// const eraseDatabaseOnSync = false;

// sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
//     if (eraseDatabaseOnSync) {
//         createUsersWithAddresss();
//     }
//
//     app.listen({ port: 8000 }, () => {
//         console.log('Apollo Server on http://localhost:8000/graphql');
//     });
// });

app.get('/*', (req, res)=> {
    res.render('index')
});
