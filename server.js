const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');
const cors = require('cors');

const app = express();

app.use(cors()) //allow cross origin

//entrypoint for every client that wants to interact with graphql on server
//app.use - is the seting up the middleware which is the function executed in the middle, after the incoming request. Express will listen for requests for that route and when it's hit, it will call the function I provided and give it three params: request, response and next.
//in this case as a second parameter I passed a result of express-graphql function, which containing three propertiea
app.use('/graphql', expressGraphQL({ 
    schema: schema,
    graphiql: true //we will be able to use graphiql IDE to test queries
}))

app.listen(4000, () => {
    console.log('server is running on port 4000')
})