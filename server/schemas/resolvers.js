const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {  
    me: async (parent, args, context) => {
    
      if (context.user) {
        const userData = await User.findById(context.user._id )
        console.log(userData)
        return userData
      } else {
      throw new AuthenticationError('You need to be logged in!');
      }
     },
    },
  
  Mutation: {
    addUser: async function (parent, { username, email, password }) {
      const user = await User.create({ username, email, password })
      const token = signToken(user)
      return { token, user }
  },
    
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { bookData }, context) => {
      console.log("ASDFASDFASDFSADFASDF")
      console.log(bookData)
      console.log(context.user)
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet : { savedBooks:  bookData  }},
          { new: true }
          
        )
        
        console.log("STRING")
        console.log(updatedUser)
      
        return updatedUser;
      }
      
    },
  
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId: bookId} } },
          
          { new: true }
          
        );
        return updatedUser;
        
      }
      throw new AuthenticationError("Login Required!");
  }
} 
};

module.exports = resolvers;