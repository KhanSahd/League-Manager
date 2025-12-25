# League Manager

A full-stack league management application with a **Spring Boot backend** and an **Expo (React Native) mobile app**.
Users can create leagues, manage teams, and maintain rosters — all authenticated via JWT.

This project is structured as a **monorepo** containing both backend and mobile code.

---

## 📁 Project Structure

```
league-manager/
├── backend/        # Spring Boot API
├── mobile/         # Expo (React Native) app
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🧠 Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Security (JWT authentication)
- Spring Data JPA
- PostgreSQL
- Gradle

### Mobile
- Expo (Managed Workflow)
- React Native
- TypeScript
- expo-router
- SecureStore (token storage)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 17+**
- **Node.js 18+**
- **PostgreSQL**
- **Docker** (optional, for database)
- **Expo Go** (on iOS / Android device)

---

## 🧩 Backend Setup

### 1️⃣ Configuration

Create a local config file:

```
backend/src/main/resources/application-local.yml
```

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/league_manager
    username: YOUR_DB_USER
    password: YOUR_DB_PASSWORD

jwt:
  secret: YOUR_JWT_SECRET

server:
  port: 8080
```

> ⚠️ This file is intentionally **ignored by Git**.
> See `application-example.yml` for a safe template.

---

### 2️⃣ Database (Optional via Docker)

You can spin up PostgreSQL using Docker:

```bash
docker compose up
```

---

### 3️⃣ Run the Backend

```bash
cd backend
./gradlew bootRun
```

Backend will start on:

```
http://localhost:8080
```

---

## 📱 Mobile App Setup

### 1️⃣ Install Dependencies

```bash
cd mobile
npm install
```

---

### 2️⃣ Run the App

```bash
npx expo start
```

Then:
- Scan QR code with **Expo Go** (iOS / Android)
- Or run in an emulator

---

## 🔐 Authentication Flow

- Users authenticate via `/auth/login`
- Backend issues a JWT
- Token is stored securely using `expo-secure-store`
- All protected API routes require a valid JWT

---

## 🧭 Core Features

- User authentication (JWT)
- Create and manage leagues
- Create teams within leagues
- Manage team rosters
- Role-based league membership
- Clean UI with consistent layout and empty states

---

## 🔒 Security Notes

- Secrets are **never committed**
- Real configs live in `application-local.yml`
- JWT secret and DB credentials must be provided locally
- `.gitignore` prevents leaking sensitive files

---

## 🧪 Testing

Backend tests live in:

```
backend/src/test/java/
```

Run tests with:

```bash
cd backend
./gradlew test
```

---

## 📌 Development Notes

- The backend is **stateless** and JWT-based
- Data is scoped by authenticated user
- UI state cleanly handles loading, empty, and populated states
- No nested Git repositories or submodules

---

## 🛠️ Future Improvements

- League invites
- Role-based permissions (admin / member)
- Editing & deleting entities
- Push notifications
- CI/CD pipeline
- Backend deployment (Render / Fly.io)
- App store builds (TestFlight / Play Store)

---

## 👤 Author

Built by **Sahd Khan**

---

## 📄 License

This project is for personal and educational use.
License can be added later if needed.
