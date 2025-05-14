# Passport.js Authentication Demo

A simple authentication system using Passport.js with GitHub OAuth.

## Setup Instructions

1. **Register a new OAuth application on GitHub**
   - Go to your GitHub account settings
   - Navigate to Developer settings > OAuth Apps > New OAuth App
   - Fill in the application details:
     - Application name: Passport Auth Demo
     - Homepage URL: http://localhost:3000
     - Authorization callback URL: http://localhost:3000/auth/github/callback
   - Register the application and note your Client ID and Client Secret

2. **Update the app configuration**
   - Open `app.js`
   - Replace `your_github_client_id` and `your_github_client_secret` with the values from GitHub
   - Update the session secret (`your-session-secret`) with a strong random string

3. **Install dependencies**
   ```
   npm install
   ```

4. **Start the application**
   ```
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `app.js` - Main server file with Passport.js configuration
- `public/` - Static files
  - `index.html` - Login page
  - `profile.html` - Protected profile page
  - `styles.css` - Styling for the application
  - `client.js` - Client-side authentication check

## Features

- GitHub OAuth authentication
- Session management
- Protected routes
- Basic user profile display

## Technologies Used

- Express.js
- Passport.js
- GitHub OAuth 2.0
- ES Modules