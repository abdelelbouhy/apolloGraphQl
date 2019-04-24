import express from 'express';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models, {sequelize} from '../models';
const {generateSchema} = require('sequelize-graphql-schema')({});
const { GraphQLSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const app = express();

import user from '../models/user';

// console.log(new GraphQLSchema(generateSchema(models)))



const userSchema = gql`
  type Query {
    user(id: Int!): User
    users: [User!]
    addresses: [Address]
  }

  type User {
    username: String!
    age: Int!
    addresses: [Address]
  }
  
   type Mutation {
     createUser(
      username: String!
      age: Int!
    ): ID!
    deleteUser(id: ID!): Boolean!
  }
`;

const addressSchema = gql`
  type Query {
    address: Address
  }

  type Address {
    street: String!
    road: String!
    user: User!
  }
  
  type Mutation {
    createAddress(text: String!): Address!
    deleteAddress(id: ID!): Boolean!
  }
`;

const schema = mergeTypes([userSchema, addressSchema], { all: true });

const userResolver = {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findByPk(id);
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
        createUser: async (parent, { username, age }, { models }) => {
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
        createAddress: async (parent, { text }, { user, models }) => {
            return await models.Address.create({
                text,
                userId: user.id,
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

const resolvers = mergeResolvers([userResolver, addressResolver]);

// const server = new ApolloServer({
//     typeDefs: schema,
//     resolvers,
//     context: { // connect sequelize to schema
//         models,
//     },
// });

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

app.use(
    '/graphql',
    graphqlHTTP({
        schema: new GraphQLSchema(generateSchema(models)),
        graphiql: true
    })
)

// server.applyMiddleware({ app, path: '/graphql' });
app
    .set('view engine', 'ejs')
    .set('views', path.resolve(__dirname, '../views'))
    .use('/dist', express.static(path.resolve(__dirname, '../dist/')));

const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    if (eraseDatabaseOnSync) {
        createUsersWithAddresss();
    }

    app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
});

app.get('/*', (req, res)=> {
    res.render('index')
});



// app.listen(8080, function() {
//     console.log('RUNNING ON 8080. Graphiql http://localhost:8080/graphql')
// })
