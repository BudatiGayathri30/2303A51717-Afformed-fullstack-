# Notification Hub

## Project Overview
A React-based notification dashboard with a standard inbox and a priority-ranked view. The application uses remote authentication bootstrap, typed environment configuration, remote logging, and paginated notification retrieval.

## Tech Stack
- React 18
- TypeScript
- Vite
- Material UI
- Axios
- TanStack React Query
- React Router v6

## Folder Structure
```text
notification-app-fe/
├── src/
│   ├── api/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── shared/
│   └── utils/
├── docs/
├── screenshots/
└── logs/
```

## Setup Instructions
1. Install dependencies with `npm install` inside `notification-app-fe`.
2. Copy `.env.example` to `.env` and provide the runtime values you need.
3. Start the development server with `npm run dev`.
4. Build for production with `npm run build`.

## Environment Variables
Reference `.env.example` for the full list of required variables.

## Available Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`

## Architecture Notes
- Environment values are validated at startup and persisted for runtime auth state.
- Remote logging is fire-and-forget and never blocks UI flow.
- Axios interceptors attach bearer tokens, log request lifecycles, and retry transient server failures once.
- Priority ranking uses a bounded min-heap so the top-N inbox stays efficient as the notification set grows.
- Error boundaries and empty states keep the UI stable when remote calls fail or return no data.

## API Endpoints Used
- `POST /register`
- `POST /auth`
- `GET /notifications`
- `POST /logs`

## Assumptions
- Notification responses can return arrays directly or inside common wrapper fields such as `notifications`, `items`, or `data`.
- Authentication bootstrap may complete before the first render, but the UI still fails open if a remote call is unavailable.
- The remote service accepts the query params and payload shapes defined in the app.
