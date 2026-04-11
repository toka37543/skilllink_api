# API Docs

Base URL: `http://localhost:3003`

## Catalog

- [Root](#root-api)
- [Login](#login-api)
- [Register User](#register-user-api)
- [Register Client](#register-client-api)
- [Forget Password](#forget-password-api)
- [Reset Password](#reset-password-api)
- [Get User Profile](#get-user-profile-api)
- [Update User Profile](#update-user-profile-api)
- [Get User Offers](#get-user-offers-api)
- [Client Index](#client-index-api)
- [Get Client Profile](#get-client-profile-api)
- [Update Client Profile](#update-client-profile-api)
- [Create Client Offer](#create-client-offer-api)
- [Get All Users](#get-all-users-api)
- [Get User By Id](#get-user-by-id-api)
- [Validation Error](#validation-error-response)
- [Unauthorized](#unauthorized-response)
- [Not Found](#not-found-response)
- [Server Error](#server-error-response)

## Root

<a id="root-api"></a>

### Name
Root

### Verb Path
`GET /`

### Request Body
No request body.

### Response Body
```text
Hello World
```

## Auth APIs

<a id="login-api"></a>

### Name
Login

### Verb Path
`POST /auth/login`

### Request Body
```json
{
  "email": "ahmed@example.com",
  "password": "password123",
  "type": "user"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "token_type": "Bearer",
    "expires_in": "1d",
    "account": {
      "id": 1,
      "first_name": "Ahmed",
      "last_name": "Ali",
      "email": "ahmed@example.com",
      "country_code": "+20",
      "phone_number": "1000000000",
      "type": "user"
    }
  }
}
```

<a id="register-user-api"></a>

### Name
Register User

### Verb Path
`POST /auth/register`

### Request Body
```json
{
  "first_name": "Ahmed",
  "last_name": "Ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "type": "user",
  "country_code": "+20",
  "phone_number": "1000000000"
}
```

### Response Body
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "first_name": "Ahmed",
    "last_name": "Ali",
    "email": "ahmed@example.com",
    "type": "user",
    "country_code": "+20",
    "phone_number": "1000000000"
  }
}
```

<a id="register-client-api"></a>

### Name
Register Client

### Verb Path
`POST /auth/register`

### Request Body
```json
{
  "first_name": "Sara",
  "last_name": "Hassan",
  "email": "sara@example.com",
  "password": "password123",
  "type": "client",
  "country_code": "+20",
  "phone_number": "1000000000",
  "company_name": "Skill Link",
  "company_details": "Hiring company profile"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "id": 1,
    "first_name": "Sara",
    "last_name": "Hassan",
    "email": "sara@example.com",
    "type": "client",
    "country_code": "+20",
    "phone_number": "1000000000",
    "company_name": "Skill Link",
    "company_details": "Hiring company profile"
  }
}
```

<a id="forget-password-api"></a>

### Name
Forget Password

### Verb Path
`POST /auth/forget-password`

### Request Body
```json
{
  "email": "ahmed@example.com",
  "type": "user"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Password reset code created successfully",
  "data": {
    "email": "ahmed@example.com",
    "type": "user",
    "code": "123456",
    "expires_in_minutes": 15
  }
}
```

<a id="reset-password-api"></a>

### Name
Reset Password

### Verb Path
`POST /auth/reset-password`

### Request Body
```json
{
  "email": "ahmed@example.com",
  "type": "user",
  "code": "123456",
  "password": "newPassword123"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## User APIs

<a id="get-user-profile-api"></a>

### Name
Get User Profile

### Verb Path
`GET /user/profile`

### Request Body
No request body.

### Response Body
```text
Get user profile
```

<a id="update-user-profile-api"></a>

### Name
Update User Profile

### Verb Path
`PUT /user/profile`

### Request Body
No request body is currently handled.

### Response Body
```text
make updates
```

<a id="get-user-offers-api"></a>

### Name
Get User Offers

### Verb Path
`GET /user/offers`

### Request Body
No request body.

### Response Body
```text
choose the offer
```

## Client APIs

<a id="client-index-api"></a>

### Name
Client Index

### Verb Path
`GET /client/`

### Request Body
No request body.

### Response Body
```text
client API
```

<a id="get-client-profile-api"></a>

### Name
Get Client Profile

### Verb Path
`GET /client/profile`

### Request Body
No request body.

### Response Body
```text
Get client profile
```

<a id="update-client-profile-api"></a>

### Name
Update Client Profile

### Verb Path
`PUT /client/profile`

### Request Body
No request body is currently handled.

### Response Body
```text
make updates
```

<a id="create-client-offer-api"></a>

### Name
Create Client Offer

### Verb Path
`POST /client/client/offers`

### Request Body
No request body is currently handled.

### Response Body
```text
post an offer
```

## Admin APIs

<a id="get-all-users-api"></a>

### Name
Get All Users

### Verb Path
`GET /admin/users`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Ahmed",
      "last_name": "Ali",
      "email": "ahmed@example.com",
      "country_code": "+20",
      "phone_number": "1000000000",
      "password": "$2b$10$hashed-password",
      "created_at": "2026-04-12T00:00:00.000Z",
      "updated_at": "2026-04-12T00:00:00.000Z"
    }
  ]
}
```

<a id="get-user-by-id-api"></a>

### Name
Get User By Id

### Verb Path
`GET /admin/users/:id`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Ahmed",
      "last_name": "Ali",
      "email": "ahmed@example.com",
      "country_code": "+20",
      "phone_number": "1000000000",
      "password": "$2b$10$hashed-password",
      "created_at": "2026-04-12T00:00:00.000Z",
      "updated_at": "2026-04-12T00:00:00.000Z"
    }
  ]
}
```

## Common Error Responses

<a id="validation-error-response"></a>

### Name
Validation Error

### Verb Path
Any endpoint with request validation.

### Request Body
Invalid request body.

### Response Body
```json
{
  "success": false,
  "message": "Validation error message"
}
```

<a id="unauthorized-response"></a>

### Name
Unauthorized

### Verb Path
`POST /auth/login`

### Request Body
Valid request body with invalid login credentials.

### Response Body
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

<a id="not-found-response"></a>

### Name
Not Found

### Verb Path
`POST /auth/forget-password`, `POST /auth/reset-password`, `GET /admin/users/:id`

### Request Body
Valid request body or route parameter for an item that does not exist.

### Response Body
```json
{
  "success": false,
  "message": "Account not found"
}
```

<a id="server-error-response"></a>

### Name
Server Error

### Verb Path
Any database-backed endpoint.

### Request Body
Valid request body.

### Response Body
```json
{
  "success": false,
  "message": "Error message"
}
```
