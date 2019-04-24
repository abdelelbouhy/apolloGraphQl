import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import models, {sequelize} from '../models';
const {generateSchema} = require('sequelize-graphql-schema')({});
const { GraphQLSchema } = require('graphql');
const app = express();

const server = new ApolloServer({
    schema: new GraphQLSchema(generateSchema(models)),
});

server.applyMiddleware({ app, path: '/graphql' });
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
