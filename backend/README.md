# Project Setup and Running Instructions

This guide provides the steps for setting up and running the project, including both the server and admin portal.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (version X.X.X or above) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

## Directory Structure

- **Root**: Contains the server-side code (Node.js, Express.js, LowDB).
- **Admin Portal**: Vue.js-based front-end located in the `admin-portal` folder.

---

## Step-by-Step Instructions

### 1. Install Dependencies

#### In the root directory:

```bash
npm install
```
This will install the necessary dependencies for the server.

#### In the admin-portal folder:
```bash
cd admin-portal
npm install
```

### 2. Run the server
#### in the root directory
```bash
node index.js
```

### 3. Run the admin portal
#### in the Admin Portal directory
```bash
npm run dev
```

### 4. Trouble shooting
#### CORS Errors
- update the admin portal port in origin
```bash
app.use(cors({
  origin: 'http://localhost:xxxx',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
```

### 3. Screenshots
#### Here are some screenshots of the UI in action:

UI
<img width="1728" alt="Screenshot 2024-12-21 at 6 56 32 PM" src="https://github.com/user-attachments/assets/e2035860-8082-4a73-aa3a-94935e778231" />
<img width="1728" alt="Screenshot 2024-12-21 at 6 57 13 PM" src="https://github.com/user-attachments/assets/9467444f-3e62-424e-83e9-f8f97cf3f361" />
<img width="1728" alt="Screenshot 2024-12-21 at 6 57 22 PM" src="https://github.com/user-attachments/assets/2ab268b0-dacf-4b56-a66f-760df23fa06a" />
