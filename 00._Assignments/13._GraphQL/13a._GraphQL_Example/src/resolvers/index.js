// src/resolvers/index.js

import { authors, books } from '../data/index.js';

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(book => book.id === id),
    authors: () => authors,
    author: (_, { id }) => authors.find(author => author.id === id)
  },
  
  Mutation: {
    createBook: (_, { authorId, title, releaseYear }) => {
      // Check if author exists
      const authorExists = authors.some(author => author.id === authorId);
      if (!authorExists) {
        throw new Error(`Author with ID ${authorId} does not exist`);
      }
      
      // Create new book
      const newBook = {
        id: String(books.length + 1),
        title,
        releaseYear,
        authorId
      };
      
      books.push(newBook);
      
      return newBook;
    },
    
    updateBook: (_, { id, authorId, title, releaseYear }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      // Check if author exists if authorId is provided
      if (authorId) {
        const authorExists = authors.some(author => author.id === authorId);
        if (!authorExists) {
          throw new Error(`Author with ID ${authorId} does not exist`);
        }
      }
      
      // Update book
      const updatedBook = {
        ...books[bookIndex],
        ...(title && { title }),
        ...(releaseYear && { releaseYear }),
        ...(authorId && { authorId })
      };
      
      books[bookIndex] = updatedBook;
      
      return updatedBook;
    },
    
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      books.splice(bookIndex, 1);
      
      return { message: `Book with ID ${id} has been deleted` };
    }
  },
  
  // Resolvers for relationships
  Book: {
    author: (book) => authors.find(author => author.id === book.authorId)
  },
  
  Author: {
    books: (author) => books.filter(book => book.authorId === author.id)
  }
};

export default resolvers;