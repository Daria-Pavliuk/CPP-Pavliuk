export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Cosmetic {
    id: ID!
    name: String!
    brand: String!
    price: Float!
    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    me: User
    cosmetics: [Cosmetic!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createCosmetic(name: String!, brand: String!, price: Float!): Cosmetic!
    deleteCosmetic(id: ID!): Boolean!
  }
`;