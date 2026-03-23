# Appointment Enquiry System

A full-stack application for managing appointment enquiries.

## Project Structure

- `backend/` - ASP.NET Core Web API
- `frontend/` - React application

## Backend

Built with ASP.NET Core Web API and Entity Framework Core with SQLite.

### Endpoints

- `GET /api/enquiries` - Get all enquiries (ordered by most recent)
- `POST /api/enquiries` - Create a new enquiry
- `DELETE /api/enquiries/{id}` - Delete a single enquiry by ID

### Running the Backend

```bash
cd backend/AppointmentEnquiryAPI
dotnet run
```

The API will be available at http://localhost:5263

## Frontend

Built with React and Vite.

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

## Features

- Form with validation for enquiry submission
- Loading state and success/error feedback on submission
- Delete individual enquiries with confirmation prompt
- Display list of saved enquiries
- SQLite database for data persistence
- CORS enabled for frontend-backend communication

## Database

The application uses SQLite with Entity Framework Core. The database file `appointments.db` will be created automatically on first run.