# GraphQL Books API

A GraphQL API built with Apollo Server that allows querying and managing books and authors.

## Features

- Query books and authors
- Create, update, and delete books
- Relationship between books and authors

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd graphql-books-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with automatic restarts:
   ```
   npm run dev
   ```

4. The GraphQL server will be running at `http://localhost:4000/graphql`

## GraphQL Schema Syntax Highlighting

### For VS Code:

1. Install the "GraphQL" extension by GraphQL Foundation
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on Mac)
   - Search for "GraphQL"
   - Install the extension by GraphQL Foundation

2. For better integration, you can also install:
   - "Apollo GraphQL" by Apollo GraphQL

### For JetBrains IDEs (WebStorm, IntelliJ, etc.):

1. Install the "GraphQL" plugin:
   - Go to Settings/Preferences > Plugins
   - Search for "GraphQL" 
   - Install the plugin
   - Restart your IDE

### For Sublime Text:

1. Install Package Control if you haven't already
2. Install "LSP" and "GraphQL LSP" packages

## Using the API

### With GraphQL Explorer (Apollo Studio)

Apollo Server provides a built-in GraphQL Explorer available at http://localhost:4000/graphql when you run the server.

### With Postman

1. Open Postman
2. Create a new request with:
   - Method: POST
   - URL: http://localhost:4000/graphql
   - Body: GraphQL
   - In the GraphQL tab, you can write your queries/mutations

### Example Queries

```graphql
# Get all books
query GetAllBooks {
  books {
    id
    title
    releaseYear
    author {
      name
    }
  }
}

# Get a specific book with its author
query GetBook {
  book(id: "1") {
    title
    releaseYear
    author {
      name
      books {
        title
      }
    }
  }
}

# Create a new book
mutation CreateBook {
  createBook(
    title: "New Book Title"
    authorId: "1"
    releaseYear: 2023
  ) {
    id
    title
    releaseYear
    author {
      name
    }
  }
}

# Update a book
mutation UpdateBook {
  updateBook(
    id: "1"
    title: "Updated Title"
  ) {
    id
    title
    releaseYear
  }
}

# Delete a book
mutation DeleteBook {
  deleteBook(id: "1") {
    message
  }
}
```

## Project Structure

```
graphql-books-api/
├── package.json
├── src/
│   ├── index.js          # Server entry point
│   ├── schema/
│   │   └── schema.graphql # GraphQL schema definition
│   ├── resolvers/
│   │   └── index.js      # Resolver functions
│   └── data/
│       └── index.js      # Mock data
```