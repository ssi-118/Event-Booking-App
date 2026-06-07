# Event Booking App

A full-stack event scheduling application with a monthly calendar view, event list sidebar, and CRUD operations for managing events.

**Live site:** [event-booking-app-rose-rho.vercel.app](https://event-booking-app-rose-rho.vercel.app)

## Features

- Monthly calendar grid with color-coded events
- Sidebar with search and category filters (work, personal, meeting, holiday, urgent, general)
- Create, edit, and delete events via a modal form
- Persistent storage with MongoDB

## Tech Stack

| Layer    | Technologies                          |
| -------- | ------------------------------------- |
| Frontend | React 19, Vite, Lucide React          |
| Backend  | Node.js, Express, Mongoose            |
| Database | MongoDB (Atlas for production)        |
| Hosting  | Vercel (static frontend + serverless API) |

## Project Structure

```
├── api/
│   └── index.js          # Vercel serverless entrypoint
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express API routes
│   └── server.js         # Express app
├── react-app/
│   ├── src/
│   │   ├── components/   # Calendar, EventList, EventModal
│   │   └── App.jsx
│   └── vite.config.js
└── vercel.json           # Vercel build & routing config
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MongoDB — local instance for development, [MongoDB Atlas](https://www.mongodb.com/atlas) for production

## Local Development

### 1. Install dependencies

```bash
cd backend && npm install
cd ../react-app && npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/event-booking
PORT=5000
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Start the frontend

In a separate terminal:

```bash
cd react-app
npm run dev
```

The app runs at `http://localhost:5173`. Vite proxies `/api` requests to the backend automatically.

## API Endpoints

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| GET    | `/api/events`       | List all events |
| POST   | `/api/events`       | Create an event |
| PUT    | `/api/events/:id`   | Update an event |
| DELETE | `/api/events/:id`   | Delete an event |

### Event fields

| Field       | Required | Description                          |
| ----------- | -------- | ------------------------------------ |
| title       | Yes      | Event name                           |
| startDate   | Yes      | ISO date string                      |
| endDate     | Yes      | ISO date string (must be after start) |
| description | No       | Event details                        |
| category    | No       | work, personal, meeting, holiday, urgent, general |
| location    | No       | Event location                       |
| color       | No       | Hex color for calendar display       |

## Deployment (Vercel)

The project is configured for Vercel with the React app served as static files and the Express backend running as a serverless function.

### Environment variables

Add the following in the [Vercel project settings](https://vercel.com) (or via CLI):

| Variable   | Environments              | Description                    |
| ---------- | ------------------------- | ------------------------------ |
| `MONGO_URI` | Production, Preview, Development | MongoDB Atlas connection string |

```bash
npx vercel env add MONGO_URI
```

> Use the exact name `MONGO_URI` (all caps). Redeploy after adding or changing environment variables.

### Deploy

Pushes to `main` deploy automatically via the connected GitHub repo. To deploy manually:

```bash
npx vercel          # preview
npx vercel --prod   # production
```

### MongoDB Atlas setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user and copy the connection string
3. Under **Network Access**, allow `0.0.0.0/0` so Vercel can connect

## Scripts

| Command              | Location    | Description              |
| -------------------- | ----------- | ------------------------ |
| `npm run dev`        | `react-app` | Start Vite dev server    |
| `npm run build`      | `react-app` | Production build         |
| `npm run dev`        | `backend`   | Start API with nodemon   |
| `npm start`          | `backend`   | Start API (production)   |
