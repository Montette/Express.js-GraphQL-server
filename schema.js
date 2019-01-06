const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


const customers = [
    {id: '1', name: 'Ann Leight', email: 'ann@gmail.com', age: 26},
    {id: '2', name: 'Tom Kolinsky', email: 'tommy-kolin@gmail.com', age: 33},
    {id: '3', name: 'Karen Bearer', email: 'k.baerer@yahoo.com', age: 29}
]

//Root query
//Instead of defining query and mutation types using schema language, like below:

// var { buildSchema } = require('graphql');

// var schema = buildSchema(`
//   type Customer {
//     id: String
//     name: String
//   }

//   type Query {
//     customer(id: String): User
//   }
// `);

//I can create them as separate object types, implement the same API without using schema language. This is particularly useful if I want to create a GraphQL schema automatically from something else, like a database schema. I might have a common format for something like creating and updating database records.

const CustomerType = new GraphQLObjectType({
    name: 'customer',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: { //'args' describe the arguments that query customer accepts-we can get customer with defined id
                id: { type: GraphQLString }    
            },
            resolve(parentValue, args) {
               return customers.filter(customer => customer.id === args.id)[0]
            }
        },
        customers: {
            type: GraphQLList(CustomerType),
            resolve() {
                return customers
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery
})