Attendance Tracking System
This project is a simple attendance tracking application built with ReactJS for the frontend and NodeJS (using the Fastify framework) for the backend. It includes a basic storage layer using MongoDB running in a Docker container. The system captures attendee's name, email, image, and timestamps for ENTRY and EXIT attendance.

Features

- Capture Attendee's Data: Use the device camera to fetch the attendee's image.
- Timestamp & Entry/Exit Tracking: Record and track ENTRY/EXIT timestamps.
- Image Matching: Validate attendee identity on ENTRY and EXIT using an image-matching library.
- Engaging UI: Fun and interactive interface.
- Dockerized Solution: Fully runnable in a Docker container for easy deployment.

Special Feature

- You cant use your face for two mail id beacuse it will validate your face by image-matching library
- you cant use same email for different face
- You cant use dupilicate entry
- Beautiful two cards in an same conatiner that will made you to register and make the entry
- You cant mark the attendance without registering
- Using same email id you cant register multiple time

  Prerequisites

- Node.js: Install Node.js (version 14 or above recommended).
- npm: Node package manager is required.
- Docker: Install Docker if you want to run the MongoDB container.
  Running Locally

Setup Instructions

1. Clone this Repository
2. cd attendance-tracking-system
3. Install Backend Dependencies:cd backend
4. npm install
5. Install Frontend Dependencies:cd frontend
6. npm install
7. After insatlling you need to start the docker in your local then gave below command

Configuration

- Node Environment: Setup a .env file in the backend to manage environment variables (e.g., storage type, database connection).

Docker Deployment

1. Build and Run Docker Containers:Ensure Docker is running and execute:
   comand:
   docker-compose build
   docker-compose up
2. Access the Application:Open your browser and visit   
   http://localhost:3000 for the frontend interface.

Testing & Validation

- Unit Testing: Use a testing framework like Jest for unit testing the backend:
  cd backend
  npm test

License

This project is released into the public domain and is free from any copyright restrictions. See the License.txt file for details.
