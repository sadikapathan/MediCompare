# MediCompare API Endpoints

## Hospitals
- GET /api/hospitals
- GET /api/hospitals?city=Pune

## Treatments
- GET /api/treatments
- GET /api/treatments?name=X-Ray
- GET /api/treatments/compare?name=X-Ray

## Health
- GET /api/health

## Admin Authentication

Admin APIs use HTTP Basic Authentication.

- Username: admin
- Authentication: HTTP Basic
- Role required: ADMIN
- Password: Stored securely using environment variables.
- Treatment POST, PUT and DELETE operations require Admin authentication.
