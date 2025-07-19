# Appointment Scheduling System

A simple appointment booking system with client and admin interfaces.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- npm

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd appointment-scheduler
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Copy environment variables
   cp .env.example .env

   # Setup database
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Run the Application

**Start Backend:**

```bash
cd backend
npm run dev
```

_Backend runs on http://localhost:5000_

**Start Frontend:**

```bash
cd frontend
npm run dev
```

_Frontend runs on http://localhost:3000_

## 🔐 Default Admin Login

- **Email:** admin@example.com
- **Password:** admin123

## 📱 Features

### Client

- View available appointment slots
- Book appointments
- View/cancel personal appointments

### Admin

- Manage time slots (add/edit/delete)
- View all appointments
- Cancel any appointment

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** SQLite

## 📂 Project Structure

```
appointment-scheduler/
├── backend/          # API server
├── frontend/         # Next.js app
└── README.md
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` in the backend directory and update:

```env
JWT_SECRET=your-secret-key
DATABASE_URL="file:./dev.db"
PORT=5000
```

## 📝 Database Reset

To reset the database:

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```
