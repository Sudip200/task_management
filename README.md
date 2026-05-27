
SET UP GUIDE   

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository_url>
   cd assignment
   ```
2. Install dependencies for both the client and server:
   ```bash
    npm install
    cd client
    npm install
   ```
3. Set up environment variables:
   - For the server, create a `.env` file in the `server` directory with
     given envexample.txt as a reference.
   - For the client, create a `.env` file in the `client` directory with
        given envexample.txt as a reference.
4 In backend it uses prisma as ORM, so you need to set up the database your postgres and run migrations:
   ```bash
    cd server
    npx prisma migrate dev --name init
   ```
5. Start the development servers:
   - In the server directory:
        ```bash
        npm run dev
        ```
    - In the client directory:
          ```bash
            npm run dev
            ```
6. Open your browser and navigate to `http://localhost:5173` to access the application.
7. You can register a new user and log in to access the profile and task management features.