# MediCompare — Healthcare Price Comparison Platform

MediCompare is a healthcare price transparency platform that helps users compare treatment prices across hospitals and make more informed healthcare decisions.

## Features

- **Treatment Price Comparison** — Compare treatment prices across hospitals.
- **Hospital Listings** — Explore hospitals and their available treatments.
- **Treatment Search** — Search for treatments such as X-Ray and Blood Test.
- **Price Difference** — View the price difference between hospitals and identify the lowest listed price.
- **Admin Panel** — Manage treatment information through the admin interface.
- **Responsive UI** — Designed to work across desktop and mobile screen sizes.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Development Tool | Vite |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Build Tool | Maven |
| Version Control | Git and GitHub |

## Project Structure

```text
MediCompare/
├── frontend/       # React application
│   ├── src/
│   └── package.json
├── medicompare/    # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── .gitignore
├── package.json
└── package-lock.json
```

## Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Java Development Kit (JDK)
- MySQL Server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sadikapathan/MediCompare.git
cd MediCompare
```

### 2. Start the backend

Configure the required database connection and environment variables in your local environment. Then run:

```powershell
cd medicompare
.\mvnw.cmd spring-boot:run
```

The backend is configured to run on port `8080` by default.

### 3. Start the frontend

Open a second terminal from the repository root and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal, usually `http://localhost:5173`.

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/hospitals` | Retrieve hospital information |
| `GET /api/treatments` | Retrieve treatment information |

Additional endpoints may be available depending on the backend implementation.

## Security Notes

- Do not commit database passwords, admin passwords, API keys, or other secrets.
- Store credentials in environment variables.
- Use secure configuration when deploying the application.

## Project Status

This project is under active development as a healthcare price comparison demo.

## Contributing

Contributions, bug reports, and suggestions are welcome. Please open an issue or submit a pull request.

## License

No license has been specified yet.
