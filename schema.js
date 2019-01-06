const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const axios = require('axios');


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
                return axios.get(`http://localhost:3000/customers/${args.id}`)
                    .then(res => res.data)
            }
        },
        customers: {
            type: GraphQLList(CustomerType),
            resolve() {
                return axios.get(`http://localhost:3000/customers`)
                .then(res => res.data)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parentValue, args) {
                return axios.post('http://localhost:3000/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res => res.data)
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return axios.delete(`http://localhost:3000/customers/${args.id}`)
                .then(res => res.data)
            }
        },
        updateCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
                .then(res => res.data)
            }
        }

    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})