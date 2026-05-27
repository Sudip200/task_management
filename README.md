SCREENSHOTS

<img width="1256" height="688" alt="image" src="https://github.com/user-attachments/assets/ea9f369f-d42a-4c3d-b0a9-6bccd647dc77" />
<img width="1362" height="491" alt="image" src="https://github.com/user-attachments/assets/b485592c-058c-41f1-a5ce-12a24e1e1be4" />
<img width="1152" height="755" alt="image" src="https://github.com/user-attachments/assets/176f0466-b942-4ce6-a5c9-a88d1b2e1317" />
<img width="1319" height="478" alt="image" src="https://github.com/user-attachments/assets/f49a9ff9-690a-4896-877a-343601ddece5" />

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
