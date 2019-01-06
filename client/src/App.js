import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost';
import gql from "graphql-tag";
import { ApolloProvider } from 'react-apollo';
import { Query } from "react-apollo";

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql"
})


const GET_CUSTOMERS = gql`
  {
    customers {
      name
      email
      age
    }
  }
`

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Query query={GET_CUSTOMERS}>
              {({loading, error, data}) => {
                if(error) return "Error  " + error.message
                if(loading) return "Loading..."
                const allCustomers = data.customers.map(customer=> (
                  <li>{customer.name}, {customer.email}, age: {customer.age}</li>
                ));
                return (
                  <ul>
                    {allCustomers}
                  </ul>
                )
              }
              }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
