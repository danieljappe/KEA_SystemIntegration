// src/resolvers/index.js

// Import mock data for authors and books
import { authors, books } from '../data/index.js';

// GraphQL resolvers define how to fetch the data for each type and field in the schema
const resolvers = {
  // Root Query type: defines how to fetch data for queries
  Query: {
    // Returns all books
    books: () => books,
    // Returns a single book by id
    book: (_, { id }) => books.find(book => book.id === id),
    // Returns all authors
    authors: () => authors,
    // Returns a single author by id
    author: (_, { id }) => authors.find(author => author.id === id)
  },
  
  // Root Mutation type: defines how to modify data
  Mutation: {
    // Create a new book
    createBook: (_, { authorId, title, releaseYear }) => {
      // Check if author exists
      const authorExists = authors.some(author => author.id === authorId);
      if (!authorExists) {
        throw new Error(`Author with ID ${authorId} does not exist`);
      }
      
      // Create new book object
      const newBook = {
        id: String(books.length + 1),
        title,
        releaseYear,
        authorId
      };
      
      books.push(newBook);
      
      return newBook;
    },
    
    // Update an existing book
    updateBook: (_, { id, authorId, title, releaseYear }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      // If authorId is provided, check if author exists
      if (authorId) {
        const authorExists = authors.some(author => author.id === authorId);
        if (!authorExists) {
          throw new Error(`Author with ID ${authorId} does not exist`);
        }
      }
      
      // Update book fields if provided
      const updatedBook = {
        ...books[bookIndex],
        ...(title && { title }),
        ...(releaseYear && { releaseYear }),
        ...(authorId && { authorId })
      };
      
      books[bookIndex] = updatedBook;
      
      return updatedBook;
    },
    
    // Delete a book by id
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      books.splice(bookIndex, 1);
      
      return { message: `Book with ID ${id} has been deleted` };
    }
  },
  
  // Field resolvers for relationships between types
  Book: {
    // For a Book, resolve its author
    author: (book) => authors.find(author => author.id === book.authorId)
  },
  
  Author: {
    // For an Author, resolve all their books
    books: (author) => books.filter(book => book.authorId === author.id)
  }
};

// Export resolvers for use in Apollo Server
export default resolvers;