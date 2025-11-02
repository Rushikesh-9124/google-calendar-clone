🗓️ Google Calendar Clone
📘 Overview

This project is a high-fidelity fullstack clone of Google Calendar, designed to replicate the core functionalities and smooth user interactions of the real Google Calendar application.
It demonstrates a strong balance between frontend interactivity, backend logic, and data synchronization — built to meet the requirements of the Computer Use Tutor Assignment.

🎯 Objective

The goal of this system is to:

Replicate core calendar features: event creation, modification, and deletion.

Provide a visually consistent and responsive UI resembling Google Calendar.

Implement backend logic to store and manage events in MongoDB.

Demonstrate smooth animations, modals, and transitions for realistic interaction.

🧩 Features
🖥️ Frontend (React)

Responsive UI with Monthly, Weekly, and Daily views.

Interactive Modals for creating, editing, and deleting events or tasks.

Dynamic rendering of events fetched from the backend.

Realistic UI transitions and hover/click feedback.

Full integration with backend APIs using Axios.

Token-based authentication (JWT-ready).

Supports multiple categories (My Tasks, Work, Personal).

⚙️ Backend (Node.js + Express)

RESTful APIs for:

GET /api/events/get-events → Fetch all events

POST /api/events/create-event → Create new event

PUT /api/events/update-event/:id → Update existing event

DELETE /api/events/delete-event/:id → Delete event

GET /api/events/get-tasks → Fetch all tasks

POST /api/events/create-task → Create new task

PUT /api/events/update-task/:id → Update existing task

DELETE /api/events/delete-task/:id → Delete task

MongoDB integration using Mongoose.

Each event and task is linked to a specific user ID.

Error handling and request validation implemented.

🗃️ Tech Stack
Layer	Technology
Frontend	React, Tailwind CSS, Axios
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Auth	JWT (JSON Web Token) ready
Deployment	Vercel (Frontend), Render (Backend)


⚡ Setup and Installation
1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/google-calendar-clone.git
cd google-calendar-clone

2️⃣ Install Dependencies
Backend
cd server
npm install

Frontend
cd client
npm install

3️⃣ Configure Environment Variables
.env (in server folder)
PORT=4000


4️⃣ Run Locally
Backend
npm start

Frontend
npm run dev

💡 Business Logic and Edge Cases

Prevents overlapping events in the same time slot.

Auto-adjusts event positions dynamically.

Real-time UI update after event CRUD operations.

Automatically sets createdAt and updatedAt timestamps.

Tasks and Events are user-linked through createdBy field.

Validation ensures all required fields are provided.

🎞️ Animations & Interactions

Modal pop-ups with smooth entry/exit transitions.

Realistic calendar view updates (month, week, day).

Interactive hover effects for event highlighting.

Lightweight transitions built using Framer Motion and Tailwind classes.

🚀 Future Enhancements

✅ Implement recurring events.

✅ Add reminders & notifications.

✅ Integrate Google OAuth for login.

✅ Drag-and-drop event rescheduling.

✅ Collaborative event sharing.

📚 Author

Rushikesh Reddy
B.Tech CSE, Bennett University
📧 rushikesh6281@gmail.com
🌍 https://linkedin.com/in/rushikesh-reddy-875516280
💼 https://fullstack-portfolio-main.netlify.app/
