# ChatDB

ChatDB is a next-gen database interface that helps developers interact with their databases in a more intuitive and efficient way. It's built with a powerful tech stack including Next.js, Clerk, Supabase, and more.

## Tech Stack

- **Frontend**: The frontend is built with Next.js, a powerful React framework that enables functionality such as server-side rendering and static site generation.
- **Backend**: Our serverless API routes are built with Node.js and hosted on Vercel.
- **Authentication**: Authentication is handled by Clerk, a complete user management and authentication service that handles user registration, login, sessions, and more.
- **Database**: We use Supabase, an open-source Firebase alternative, for storing user data. 
- **API calls**: We use the Fetch API for making HTTP requests to our serverless API routes.
- **Environment Variables**: Environment variables are managed using the `next.config.js` file and Vercel Environment Variables for deployment.
- 
### Running Locally

**Install Dependencies**

`npm install`

**Bring up the APP**

`vercel dev`


Remember, you'll need to provide your own environment variables for connecting to Supabase, Clerk, and any other services your app uses.

