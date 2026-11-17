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

## Example API Requests

### Get All Hospitals
GET http://localhost:8080/api/hospitals

### Get All Treatments
GET http://localhost:8080/api/treatments

### Compare Treatment Prices
GET http://localhost:8080/api/treatments/compare?name=X-Ray

### Check API Health
GET http://localhost:8080/api/health
