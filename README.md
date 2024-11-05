# Aperçu

**Aperçu** is a web application designed to give clients an insight into my work, services, and expertise. This app offers an easy-to-navigate interface where clients can learn more about the services I provide, view pricing details, and find out more about my background and skills.

## Features

- **About Me**: A dedicated section that showcases my experience, background, and unique skills.
- **Services**: Detailed descriptions of each service offered, with relevant information on what clients can expect.
- **Pricing**: Transparent pricing details for each service, ensuring clients have clarity on costs.
- **Contact Form**: Allows clients to reach out with inquiries directly through the app.
- **User Authentication**: Secure login for clients to save their favorite services or track their inquiries.

## Technology Stack

- **Frontend**: React
- **Backend**: Python FastAPI
- **Database**: MySQL
- **Containerization**: Docker
- **Deployment**: Hosted on [Synology NAS](https://apercu.sacenpapier.synology.me/)

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (for frontend)
- [Python 3.9+](https://www.python.org/) (for backend)
- [MySQL](https://www.mysql.com/) (or another SQL-compatible database)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Steps

## How to Run with Docker Compose

To run Aperçu using Docker Compose, follow these steps.

### Step 1: Set Up Environment Variables

1. **Create a `.env` file in the root directory** with the following variables to set up the environment for Docker Compose:

   ```env
   # Root .env
   MYSQL_ROOT_PASSWORD=your_mysql_root_password
   MYSQL_DATABASE=apercu_db
   MYSQL_USER=apercu_user
   MYSQL_PASSWORD=your_mysql_password
    ```
2. **Create a `backend/.env` file** with the following variables to set up the backend environment:

   ```env
   # backend/.env
   DATABASE_URL=mysql://apercu_user:your_mysql_password@mysql:3306/apercu_db
   ```

3. **Create a `frontend/.env` file** with the following variables to set up the frontend environment:

   ```env
   # frontend/.env
   REACT_APP_API_URL=http://localhost:8000
   ```
### Step 2: Build and Run the Docker Containers

1. **Build the Docker containers** using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. **Access the Aperçu app** by visiting [http://localhost:3000](http://localhost:3000) in your web browser.


## How to Run Locally for Development

To run Aperçu locally for development, follow these steps.

### Step 1: Set Up the Backend

1. **Navigate to the `backend` directory**:

   ```bash
   cd backend
   ```
2. **Install the Python dependencies**:

   ```bash
    pip install -r requirements.txt
    ```
3. **Run the FastAPI server**:

   ```bash
   uvicorn main:app --reload
   ```
4. **Access the FastAPI server** by visiting [http://localhost:8000/docs](http://localhost:8000/docs) in your web browser.

### Step 2: Set Up the Frontend

1. **Navigate to the `frontend` directory**:

   ```bash
   cd frontend
   ```
2. **Install the Node.js dependencies**:

   ```bash
    npm install
    ```
3. **Run the React development server**:

   ```bash
   npm run dev
   ```
4. **Access the React app** by visiting [http://localhost:3000](http://localhost:3000) in your web browser.

## Acknowledgements

- [Alembic](https://alembic.sqlalchemy.org/en/latest/) for database migrations
- [Docker](https://www.docker.com/) for containerization
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend library
- [SQLAlchemy](https://www.sqlalchemy.org/) for the database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [UVicorn](https://www.uvicorn.org/) for the ASGI server
- [Visual Studio Code](https://code.visualstudio.com/) for the code editor
