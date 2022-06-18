import { ApolloServer, gql } from "apollo-server";

let tweets = [
  { id: "1", text: "first tweet!", author: "1" },
  { id: "2", text: "second tweet!", author: "2" },
];

let users = [
  { id: "1", firstName: "Jungmin", lastName: "Lee" },
  { id: "2", firstName: "Byungjin", lastName: "Park" },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      if (!users.find((user) => user.id === userId)) {
        return new Error("You need correct userId");
      }
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet({}) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Runnig on ${url}`);
});
