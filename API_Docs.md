# API Docs

Base URL: `http://localhost:3003`

Protected endpoints require:
```text
Authorization: Bearer <jwt-token>
```

## Catalog

- [GET / Root](#root)
- [POST /auth/login Login](#login)
- [POST /auth/register Register](#register)
- [POST /auth/forget-password Forget Password](#forget-password)
- [POST /auth/reset-password Reset Password](#reset-password)
- [GET /user/profile Get My User Profile](#get-my-user-profile)
- [PUT /user/profile Update My User Profile](#update-my-user-profile)
- [GET /user/profiles/:user_id Get Public User Profile](#get-public-user-profile)
- [GET /user/jobs Get Matching Jobs](#get-matching-jobs)
- [GET /user/offers Get My Offers](#get-my-offers)
- [POST /user/jobs/:job_id/offers Apply To Job](#apply-to-job)
- [POST /user/jobs/:job_id/submit-completion Submit Job Completion](#submit-job-completion)
- [POST /user/jobs/:job_id/approve-completion User Approve Job Completion](#user-approve-job-completion)
- [GET /client/ Client Index](#client-index)
- [GET /client/profile Get Client Profile](#get-client-profile)
- [PUT /client/profile Update Client Profile](#update-client-profile)
- [POST /client/jobs Create Job](#create-job)
- [GET /client/jobs Get Client Jobs](#get-client-jobs)
- [GET /client/jobs/:job_id/offers Get Job Offers](#get-job-offers)
- [POST /client/offers/:offer_id/accept Accept Offer](#accept-offer)
- [POST /client/jobs/:job_id/approve-completion Client Approve Job Completion](#client-approve-job-completion)
- [GET /chats Get Chat Rooms](#get-chat-rooms)
- [GET /chats/:chat_room_id/tasks Get Chat Tasks](#get-chat-tasks)
- [POST /chats/:chat_room_id/tasks Create Chat Task](#create-chat-task)
- [PUT /chats/tasks/:task_id Update Chat Task](#update-chat-task)
- [GET /chats/:chat_room_id/attachments Get Chat Attachments](#get-chat-attachments)
- [POST /chats/:chat_room_id/attachments Create Chat Attachment](#create-chat-attachment)
- [GET /payments/wallet Get Wallet](#get-wallet)
- [POST /payments/top-up Top Up Wallet](#top-up-wallet)
- [GET /admin/users Get All Users](#get-all-users)
- [GET /admin/users/:id Get User By Id](#get-user-by-id)

## Root

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

## Login

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
      "email": "ahmed@example.com",
      "type": "user"
    }
  }
}
```

## Register

### Name
Register

### Verb Path
`POST /auth/register`

### Request Body
```json
{
  "first_name": "Ahmed",
  "last_name": "Ali",
  "email": "ahmed@example.com",
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
    "first_name": "Ahmed",
    "last_name": "Ali",
    "email": "ahmed@example.com",
    "type": "client"
  }
}
```

## Forget Password

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

## Reset Password

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

## Get My User Profile

### Name
Get My User Profile

### Verb Path
`GET /user/profile`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "skills": ["node", "mysql"],
    "speciality": "backend",
    "university": "Cairo University"
  }
}
```

## Update My User Profile

### Name
Update My User Profile

### Verb Path
`PUT /user/profile`

### Request Body
```json
{
  "skills": ["node", "mysql"],
  "speciality": "backend",
  "certificates": [{"name": "Backend Certificate"}],
  "university": "Cairo University",
  "projects": [{"name": "SkillLink API", "url": "https://example.com"}],
  "github_url": "https://github.com/user",
  "behance_url": "https://behance.net/user",
  "linkedin_url": "https://linkedin.com/in/user",
  "social_links": {"portfolio": "https://example.com"}
}
```

### Response Body
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": 1,
    "skills": ["node", "mysql"],
    "speciality": "backend"
  }
}
```

## Get Public User Profile

### Name
Get Public User Profile

### Verb Path
`GET /user/profiles/:user_id`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": {
    "user": {"id": 1, "first_name": "Ahmed"},
    "profile": {"speciality": "backend", "skills": ["node"]}
  }
}
```

## Get Matching Jobs

### Name
Get Matching Jobs

### Verb Path
`GET /user/jobs`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Build API",
      "speciality": "backend",
      "status": "open"
    }
  ]
}
```

## Get My Offers

### Name
Get My Offers

### Verb Path
`GET /user/offers`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [
    {"id": 1, "job_id": 1, "status": "pending"}
  ]
}
```

## Apply To Job

### Name
Apply To Job

### Verb Path
`POST /user/jobs/:job_id/offers`

### Request Body
```json
{
  "description": "I can finish this API.",
  "budget": 500,
  "time_to_finish": "7 days"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Offer sent successfully",
  "data": {
    "id": 1,
    "job_id": 1,
    "status": "pending"
  }
}
```

## Submit Job Completion

### Name
Submit Job Completion

### Verb Path
`POST /user/jobs/:job_id/submit-completion`

### Request Body
```json
{
  "files": [
    {
      "file_name": "final.zip",
      "file_url": "https://example.com/final.zip",
      "file_type": "application/zip"
    }
  ]
}
```

### Response Body
```json
{
  "success": true,
  "message": "Completion files submitted successfully",
  "data": {
    "job": {"id": 1, "status": "in_progress"},
    "attachments": []
  }
}
```

## User Approve Job Completion

### Name
User Approve Job Completion

### Verb Path
`POST /user/jobs/:job_id/approve-completion`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "message": "Job completion approved successfully",
  "data": {"id": 1, "status": "completed"}
}
```

## Client Index

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

## Get Client Profile

### Name
Get Client Profile

### Verb Path
`GET /client/profile`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "Skill Link"
  }
}
```

## Update Client Profile

### Name
Update Client Profile

### Verb Path
`PUT /client/profile`

### Request Body
```json
{
  "first_name": "Sara",
  "last_name": "Hassan",
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
  "message": "Client profile updated successfully",
  "data": {"id": 1, "company_name": "Skill Link"}
}
```

## Create Job

### Name
Create Job

### Verb Path
`POST /client/jobs`

### Request Body
```json
{
  "title": "Build API",
  "description": "Build a Node.js API.",
  "budget": 500,
  "speciality": "backend",
  "needed_skills": ["node", "mysql"]
}
```

### Response Body
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {"id": 1, "status": "open"}
}
```

## Get Client Jobs

### Name
Get Client Jobs

### Verb Path
`GET /client/jobs`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [{"id": 1, "title": "Build API"}]
}
```

## Get Job Offers

### Name
Get Job Offers

### Verb Path
`GET /client/jobs/:job_id/offers`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [{"id": 1, "job_id": 1, "status": "pending"}]
}
```

## Accept Offer

### Name
Accept Offer

### Verb Path
`POST /client/offers/:offer_id/accept`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "message": "Offer accepted successfully",
  "data": {
    "job": {"id": 1, "status": "in_progress"},
    "offer": {"id": 1, "status": "accepted"},
    "chat_room": {"id": 1}
  }
}
```

## Client Approve Job Completion

### Name
Client Approve Job Completion

### Verb Path
`POST /client/jobs/:job_id/approve-completion`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "message": "Job completion approved successfully",
  "data": {"id": 1, "status": "completed"}
}
```

## Get Chat Rooms

### Name
Get Chat Rooms

### Verb Path
`GET /chats`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [{"id": 1, "job_id": 1}]
}
```

## Get Chat Tasks

### Name
Get Chat Tasks

### Verb Path
`GET /chats/:chat_room_id/tasks`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [{"id": 1, "title": "Todo", "status": "todo"}]
}
```

## Create Chat Task

### Name
Create Chat Task

### Verb Path
`POST /chats/:chat_room_id/tasks`

### Request Body
```json
{
  "title": "Review final files",
  "description": "Check the final ZIP."
}
```

### Response Body
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {"id": 1, "status": "todo"}
}
```

## Update Chat Task

### Name
Update Chat Task

### Verb Path
`PUT /chats/tasks/:task_id`

### Request Body
```json
{
  "status": "done"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {"id": 1, "status": "done"}
}
```

## Get Chat Attachments

### Name
Get Chat Attachments

### Verb Path
`GET /chats/:chat_room_id/attachments`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": [{"id": 1, "file_name": "final.zip"}]
}
```

## Create Chat Attachment

### Name
Create Chat Attachment

### Verb Path
`POST /chats/:chat_room_id/attachments`

### Request Body
```json
{
  "file_name": "notes.pdf",
  "file_url": "https://example.com/notes.pdf",
  "file_type": "application/pdf",
  "purpose": "chat"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Attachment created successfully",
  "data": {"id": 1, "file_name": "notes.pdf"}
}
```

## Get Wallet

### Name
Get Wallet

### Verb Path
`GET /payments/wallet`

### Request Body
No request body.

### Response Body
```json
{
  "success": true,
  "data": {"id": 1, "balance": "500.00", "held_balance": "0.00"}
}
```

## Top Up Wallet

### Name
Top Up Wallet

### Verb Path
`POST /payments/top-up`

### Request Body
```json
{
  "amount": 500,
  "currency": "USD",
  "payment_method": "sudo-card"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Wallet topped up successfully",
  "data": {
    "payment": {"status": "paid"},
    "wallet": {"balance": "500.00"}
  }
}
```

## Get All Users

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
  "data": [{"id": 1, "email": "ahmed@example.com"}]
}
```

## Get User By Id

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
  "data": {"id": 1, "email": "ahmed@example.com"}
}
```
