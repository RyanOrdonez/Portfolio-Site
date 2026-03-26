# Maevie Project Manager

A full-stack web application built for interior design companies to manage projects, clients, and workflows. Maevie provides an intuitive interface for tracking design projects from initial consultation through final delivery.

## Features

- User authentication and authorization with JWT
- Project creation, tracking, and management
- Client management dashboard
- Role-based access control
- Responsive design for desktop and mobile

## Tech Stack

### Frontend
- **React.js** -- Component-based UI
- **Tailwind CSS** -- Utility-first styling
- **Redux** -- State management

### Backend
- **Node.js** with **Express** -- REST API server
- **PostgreSQL** -- Relational database
- **Prisma** -- ORM and database toolkit
- **JWT** -- Authentication and session management

### Deployment
- **Frontend:** Netlify
- **Backend:** Hosted separately

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/MaevieProjectManager.git
   cd MaevieProjectManager
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Update DATABASE_URL, JWT_SECRET, and other required variables
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Running Locally

Start the backend:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd client
npm start
```

## Repository Structure

```
MaevieProjectManager/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   └── pages/
│   └── package.json
├── server/             # Express backend
│   ├── prisma/
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── README.md
```

## Author

Ryan
