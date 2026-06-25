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
- [POST /user/profile/phone/send-otp Send User Phone OTP](#send-user-phone-otp)
- [PUT /user/profile/phone/verify Verify User Phone Number](#verify-user-phone-number)
- [PUT /user/profile-picture Update Profile Picture](#update-profile-picture)
- [GET /user/profiles/:user_id Get Public User Profile](#get-public-user-profile)
- [GET /user/jobs Get Matching Jobs](#get-matching-jobs)
- [GET /user/offers Get My Offers](#get-my-offers)
- [POST /user/jobs/:job_id/offers Apply To Job](#apply-to-job)
- [POST /user/jobs/:job_id/submit-completion Submit Job Completion](#submit-job-completion)
- [POST /user/jobs/:job_id/approve-completion User Approve Job Completion](#user-approve-job-completion)
- [GET /client/ Client Index](#client-index)
- [GET /client/profile Get Client Profile](#get-client-profile)
- [PUT /client/profile Update Client Profile](#update-client-profile)
- [POST /client/profile/phone/send-otp Send Client Phone OTP](#send-client-phone-otp)
- [PUT /client/profile/phone/verify Verify Client Phone Number](#verify-client-phone-number)
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
  "username": "ahmed123",
  "email": "ahmed@example.com",
  "password": "password123",
  "type": "client"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "id": 1,
    "username": "ahmed123",
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
    "university": "Cairo University",
    "college": "Faculty of Computers and Artificial Intelligence",
    "study_years": "2019-2023",
    "date_of_birth": "2001-05-15",
    "address": "Cairo, Egypt",
    "languages": ["Arabic", "English"],
    "brief": "Backend developer focused on Node.js and MySQL APIs.",
    "profile_picture_url": "https://example.com/uploads/profile.jpg"
  }
}
```

## Update My User Profile

### Name
Update My User Profile

### Verb Path
`PUT /user/profile`

### Request Body
This is a partial update. Send only the fields that changed. Phone fields are not accepted here; use `POST /user/profile/phone/send-otp`, then `PUT /user/profile/phone/verify`.

```json
{
  "first_name": "Ahmed",
  "last_name": "Ali",
  "skills": ["node", "mysql"],
  "speciality": "backend",
  "certificates": [{"name": "Backend Certificate"}],
  "university": "Cairo University",
  "college": "Faculty of Computers and Artificial Intelligence",
  "study_years": "2019-2023",
  "date_of_birth": "2001-05-15",
  "address": "Cairo, Egypt",
  "languages": ["Arabic", "English"],
  "brief": "Backend developer focused on Node.js and MySQL APIs.",
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
    "user": {
      "id": 1,
      "first_name": "Ahmed",
      "last_name": "Ali"
    },
    "profile": {
      "user_id": 1,
      "skills": ["node", "mysql"],
      "speciality": "backend",
      "university": "Cairo University",
      "college": "Faculty of Computers and Artificial Intelligence",
      "study_years": "2019-2023"
    }
  }
}
```

## Send User Phone OTP

### Name
Send User Phone OTP

### Verb Path
`POST /user/profile/phone/send-otp`

### Request Body
Step 1 for changing a student phone number. For local development, the static OTP is `123456` and is returned in the response.

```json
{
  "country_code": "+20",
  "phone_number": "1000000000"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Phone verification OTP sent successfully",
  "data": {
    "country_code": "+20",
    "phone_number": "1000000000",
    "otp": "123456"
  }
}
```

## Verify User Phone Number

### Name
Verify User Phone Number

### Verb Path
`PUT /user/profile/phone/verify`

### Request Body
Step 2 for changing a student phone number. Send the same phone number with the OTP, then the API verifies and updates the account.

```json
{
  "country_code": "+20",
  "phone_number": "1000000000",
  "otp": "123456"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Phone number verified and updated successfully",
  "data": {
    "id": 1,
    "country_code": "+20",
    "phone_number": "1000000000",
    "phone_verified_at": "2026-04-20T10:00:00.000Z",
    "type": "user"
  }
}
```

## Update Profile Picture

### Name
Update Profile Picture

### Verb Path
`PUT /user/profile-picture`

### Request Body
Use this to upload a student profile image directly to the API. Send `multipart/form-data` with a file field named `profile_picture`. The file must be JPG, PNG, or WEBP and 2MB or smaller. The API stores the file locally and exposes it through the static `/uploads/profile-pictures` path.

```text
profile_picture: <binary jpg/png/webp file>
```

### Response Body
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "data": {
    "profile": {
      "user_id": 1,
      "profile_picture_url": "http://localhost:3003/uploads/profile-pictures/profile.jpg"
    },
    "file": {
      "url": "http://localhost:3003/uploads/profile-pictures/profile.jpg",
      "path": "/uploads/profile-pictures/profile.jpg",
      "mime_type": "image/jpeg",
      "size": 132456
    }
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
    "profile": {
      "speciality": "backend",
      "skills": ["node"],
      "profile_picture_url": "https://example.com/uploads/profile.jpg"
    }
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
    "first_name": "Sara",
    "last_name": "Hassan",
    "location": "Dubai, UAE",
    "languages": ["Arabic", "English"],
    "about": "Operations lead managing hiring partnerships and delivery.",
    "company_name": "Skill Link",
    "industry": "Recruitment Technology",
    "website": "https://skilllink.example.com",
    "company_description": "Hiring company profile"
  }
}
```

## Update Client Profile

### Name
Update Client Profile

### Verb Path
`PUT /client/profile`

### Request Body
This is a partial update. Send only the fields that changed. Phone fields are not accepted here; use `POST /client/profile/phone/send-otp`, then `PUT /client/profile/phone/verify`.

```json
{
  "first_name": "Sara",
  "last_name": "Hassan",
  "location": "Dubai, UAE",
  "languages": ["Arabic", "English"],
  "about": "Operations lead managing hiring partnerships and delivery.",
  "company_name": "Skill Link",
  "industry": "Recruitment Technology",
  "website": "https://skilllink.example.com",
  "company_description": "Hiring company profile"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Client profile updated successfully",
  "data": {
    "id": 1,
    "first_name": "Sara",
    "last_name": "Hassan",
    "location": "Dubai, UAE",
    "languages": ["Arabic", "English"],
    "company_name": "Skill Link",
    "industry": "Recruitment Technology",
    "website": "https://skilllink.example.com",
    "company_description": "Hiring company profile"
  }
}
```

## Send Client Phone OTP

### Name
Send Client Phone OTP

### Verb Path
`POST /client/profile/phone/send-otp`

### Request Body
Step 1 for changing a client phone number. For local development, the static OTP is `123456` and is returned in the response.

```json
{
  "country_code": "+20",
  "phone_number": "1000000000"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Phone verification OTP sent successfully",
  "data": {
    "country_code": "+20",
    "phone_number": "1000000000",
    "otp": "123456"
  }
}
```

## Verify Client Phone Number

### Name
Verify Client Phone Number

### Verb Path
`PUT /client/profile/phone/verify`

### Request Body
Step 2 for changing a client phone number. Send the same phone number with the OTP, then the API verifies and updates the account.

```json
{
  "country_code": "+20",
  "phone_number": "1000000000",
  "otp": "123456"
}
```

### Response Body
```json
{
  "success": true,
  "message": "Phone number verified and updated successfully",
  "data": {
    "id": 1,
    "country_code": "+20",
    "phone_number": "1000000000",
    "phone_verified_at": "2026-04-20T10:00:00.000Z",
    "type": "client"
  }
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

---

# Newly added endpoints

These endpoints were added to support frontend screens that previously fell back
to mock data (saved jobs, reports, notifications, chat messages) plus single job
details. All require `Authorization: Bearer <jwt-token>`.

## Get Job Details

### Verb Path
`GET /user/jobs/:job_id`

### Response Body
```json
{
  "success": true,
  "data": { "id": 1, "title": "Landing page", "budget": 500, "speciality": "frontend", "needed_skills": ["vue"], "status": "open", "saved": false }
}
```
Returns `404 { "success": false, "message": "Job not found" }` when the id is unknown.

## Saved Jobs (bookmarks)

Available for both account types. Use the `/user/...` paths when logged in as a
freelancer and `/client/...` when logged in as a client.

### Verb Paths
- `GET /user/saved-jobs` — list saved jobs
- `POST /user/jobs/:job_id/save` — save a job
- `DELETE /user/jobs/:job_id/save` — remove a saved job
- `GET /client/saved-jobs`, `POST /client/jobs/:job_id/save`, `DELETE /client/jobs/:job_id/save` — client equivalents

### Response Body (list)
```json
{
  "success": true,
  "data": [ { "id": 1, "title": "Landing page", "saved": true, "saved_at": "2026-06-25T10:00:00.000Z" } ]
}
```

### Response Body (save / unsave)
```json
{ "success": true, "message": "Job saved successfully", "data": { "job_id": 1, "saved": true } }
```

## Reports

Available for both account types (`/user/reports` and `/client/reports`).

### Verb Paths
- `GET /user/reports` — list my reports
- `POST /user/reports` — submit a report

### Request Body (POST)
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "issue_type": "technical",
  "description": "The apply button does nothing.",
  "attachment_url": "https://example.com/screenshot.png"
}
```
Only `description` is required.

### Response Body
```json
{ "success": true, "message": "Report submitted successfully", "data": { "id": 1, "status": "open" } }
```

## Notifications

### Verb Paths
- `GET /notifications` — list notifications + unread count
- `PUT /notifications/:id/read` — mark one as read

Notifications are created automatically when a freelancer applies to a job, when a
client accepts an offer, and when a chat message is sent.

### Response Body (list)
```json
{
  "success": true,
  "data": {
    "items": [ { "id": 1, "type": "offer_accepted", "title": "Your offer was accepted", "body": "...", "link": "/", "read_at": null } ],
    "unread_count": 1
  }
}
```

## Chat Messages

### Verb Paths
- `GET /chats/:chat_room_id/messages` — list messages (also marks the other party's messages read)
- `POST /chats/:chat_room_id/messages` — send a message

### Request Body (POST)
```json
{ "body": "Hi, when can you start?" }
```
`text` is accepted as an alias for `body`. Only participants of the chat room may
read or post; others get `404 Chat room not found`.

### Response Body
```json
{ "success": true, "message": "Message sent successfully", "data": { "id": 1, "chat_room_id": 1, "sender_type": "client", "body": "Hi, when can you start?" } }
```

## Payments — mock gateway

`POST /payments/top-up` runs the charge through a **mock gateway** (no real money).
Use these test credit-card numbers to demo each outcome:

| Card number          | Result                          |
| -------------------- | ------------------------------- |
| 4242 4242 4242 4242  | approved                        |
| 4000 0000 0000 0002  | declined (`card_declined`)      |
| 4000 0000 0000 9995  | declined (`insufficient_funds`) |
| 4000 0000 0000 0069  | declined (`expired_card`)       |
| (fails Luhn check)   | declined (`invalid_card`)       |

Non-card methods (`vodafone`, `fawry`, `instapay`) are always approved.

### Request Body
```json
{
  "amount": 500,
  "currency": "USD",
  "payment_method": "creditCard",
  "payment_details": { "card_number": "4242424242424242", "expiry": "12/29", "cvv": "123", "cardholder_name": "Ahmed Ali" }
}
```

### Response Body (approved)
```json
{
  "success": true,
  "message": "Wallet topped up successfully",
  "data": { "payment": { "success": true, "status": "paid", "transaction_id": "mock_creditCard_123" }, "wallet": { "balance": "500.00" } }
}
```

### Response Body (declined)
```json
{ "success": false, "message": "Card was declined (card_declined)", "data": { "success": false, "status": "declined", "decline_code": "card_declined" } }
```
