import express from 'express';
import path from 'path';
import {ApolloServer, gql} from 'apollo-server-express';
import models, {sequelize} from '../models';
import GenerateSchema from 'sequelize-graphql-schema'
import {GraphQLSchema} from 'graphql';
import {merge} from 'lodash'
import {mergeResolvers, mergeTypes} from 'merge-graphql-schemas';
import {makeExecutableSchema, mergeSchemas} from 'graphql-tools';

const app = express();

const generateSchema = GenerateSchema({}).generateSchema;

const testSchema = gql`
  type Query {
    test: Int
    test2: Int
  }
 `;
const testResolver = {
    Query: {
        test: async (parent, args, {models}) => {
            return 123;
        },
        test2: async (parent, args, {models}) => {
            return 456;
        }
    }
};

export const schema1 = makeExecutableSchema({
    typeDefs: testSchema,
    resolvers: testResolver
});
const schema = new GraphQLSchema(generateSchema(models));

const server = new ApolloServer({
    schema: mergeSchemas({
            schemas: [
                schema,
                schema1,
            ],
        }),
});

server.applyMiddleware({ app, path: '/graphql' });
app
    .set('view engine', 'ejs')
    .set('views', path.resolve(__dirname, '../views'))
    .use('/dist', express.static(path.resolve(__dirname, '../dist/')));

const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
});

app.get('/*', (req, res)=> {
    res.render('index')
});
