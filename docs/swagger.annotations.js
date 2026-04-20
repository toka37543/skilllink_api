/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required: [email, password, type]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: ahmed@example.com
 *         password:
 *           type: string
 *           example: password123
 *         type:
 *           type: string
 *           enum: [user, client]
 *           example: user
 *     RegisterRequest:
 *       type: object
 *       required: [username, email, password, type]
 *       properties:
 *         username:
 *           type: string
 *           example: ahmed123
 *         email:
 *           type: string
 *           format: email
 *           example: ahmed@example.com
 *         password:
 *           type: string
 *           example: password123
 *         type:
 *           type: string
 *           enum: [user, client]
 *           example: client
 *     UserProfileRequest:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: Ahmed
 *         last_name:
 *           type: string
 *           example: Ali
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           example: [node, mysql]
 *         speciality:
 *           type: string
 *           example: backend
 *         certificates:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ name: Backend Certificate }]
 *         university:
 *           type: string
 *           example: Cairo University
 *         college:
 *           type: string
 *           example: Faculty of Computers and Artificial Intelligence
 *         study_years:
 *           type: string
 *           example: 2019-2023
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: 2001-05-15
 *         address:
 *           type: string
 *           example: Cairo, Egypt
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: [Arabic, English]
 *         brief:
 *           type: string
 *           example: Backend developer focused on Node.js and MySQL APIs.
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ name: SkillLink API, url: https://example.com }]
 *         github_url:
 *           type: string
 *           example: https://github.com/user
 *         behance_url:
 *           type: string
 *           example: https://behance.net/user
 *         linkedin_url:
 *           type: string
 *           example: https://linkedin.com/in/user
 *         social_links:
 *           type: object
 *           example: { portfolio: https://example.com }
 *     PhoneOtpRequest:
 *       type: object
 *       required: [country_code, phone_number]
 *       properties:
 *         country_code:
 *           type: string
 *           example: "+20"
 *         phone_number:
 *           type: string
 *           example: "1000000000"
 *     PhoneVerificationRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/PhoneOtpRequest'
 *         - type: object
 *           required: [otp]
 *           properties:
 *             otp:
 *               type: string
 *               example: "123456"
 *     ProfilePictureRequest:
 *       type: object
 *       required: [profile_picture]
 *       properties:
 *         profile_picture:
 *           type: string
 *           format: binary
 *     ClientProfileRequest:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: Sara
 *         last_name:
 *           type: string
 *           example: Hassan
 *         company_name:
 *           type: string
 *           example: Skill Link
 *         company_details:
 *           type: string
 *           example: Hiring company profile
 *     JobRequest:
 *       type: object
 *       required: [title, description, budget, speciality, needed_skills]
 *       properties:
 *         title:
 *           type: string
 *           example: Build API
 *         description:
 *           type: string
 *           example: Build a Node.js API.
 *         budget:
 *           type: number
 *           example: 500
 *         speciality:
 *           type: string
 *           example: backend
 *         needed_skills:
 *           type: array
 *           items:
 *             type: string
 *           example: [node, mysql]
 *     OfferRequest:
 *       type: object
 *       required: [description, budget, time_to_finish]
 *       properties:
 *         description:
 *           type: string
 *           example: I can finish this API.
 *         budget:
 *           type: number
 *           example: 500
 *         time_to_finish:
 *           type: string
 *           example: 7 days
 *     CompletionRequest:
 *       type: object
 *       required: [files]
 *       properties:
 *         files:
 *           type: array
 *           items:
 *             type: object
 *             required: [file_name, file_url]
 *             properties:
 *               file_name:
 *                 type: string
 *                 example: final.zip
 *               file_url:
 *                 type: string
 *                 example: https://example.com/final.zip
 *               file_type:
 *                 type: string
 *                 example: application/zip
 *     ChatTaskRequest:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           example: Review final files
 *         description:
 *           type: string
 *           example: Check the final ZIP.
 *     ChatTaskStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [todo, done]
 *           example: done
 *     AttachmentRequest:
 *       type: object
 *       required: [file_name, file_url]
 *       properties:
 *         file_name:
 *           type: string
 *           example: notes.pdf
 *         file_url:
 *           type: string
 *           example: https://example.com/notes.pdf
 *         file_type:
 *           type: string
 *           example: application/pdf
 *         purpose:
 *           type: string
 *           enum: [chat, completion]
 *           example: chat
 *     TopUpRequest:
 *       type: object
 *       required: [amount]
 *       properties:
 *         amount:
 *           type: number
 *           example: 500
 *         currency:
 *           type: string
 *           example: USD
 *         payment_method:
 *           type: string
 *           example: sudo-card
 * tags:
 *   - name: Root
 *   - name: Auth
 *   - name: Users
 *   - name: Clients
 *   - name: Jobs
 *   - name: Chats
 *   - name: Payments
 *   - name: Docs
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Root]
 *     summary: Root
 *     description: Use this as a lightweight health check to confirm the API server is responding.
 *     responses:
 *       200:
 *         description: Plain text health response.
 *         content:
 *           text/plain:
 *             example: Hello World
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     description: Use this when the frontend needs to authenticate a user or client and receive a Bearer token for protected endpoints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Login successful
 *               data:
 *                 token: jwt-token
 *                 token_type: Bearer
 *                 expires_in: 1d
 *                 account:
 *                   id: 1
 *                   email: ahmed@example.com
 *                   type: user
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a user or client
 *     description: Use this on signup screens. It only creates login credentials and account type. Profile details are completed later through profile update endpoints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Client registered successfully
 *               data:
 *                 id: 1
 *                 username: sara123
 *                 email: sara@example.com
 *                 type: client
 *       400:
 *         description: Validation or duplicate email error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Email already exists
 */

/**
 * @swagger
 * /user/profile/phone/send-otp:
 *   post:
 *     tags: [Users]
 *     summary: Send user phone verification OTP
 *     description: "Step 1 for changing a student phone number. In local development the OTP is static: 123456 and is returned in the response."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Phone verification OTP sent successfully
 *               data:
 *                 country_code: "+20"
 *                 phone_number: "1000000000"
 *                 otp: "123456"
 *       400:
 *         description: Validation error.
 */

/**
 * @swagger
 * /user/profile/phone/verify:
 *   put:
 *     tags: [Users]
 *     summary: Verify and update user phone number
 *     description: "Step 2 for changing a student phone number. Send the phone number and OTP, then the API updates the account phone fields."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneVerificationRequest'
 *     responses:
 *       200:
 *         description: Phone verified and updated.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Phone number verified and updated successfully
 *               data:
 *                 id: 1
 *                 country_code: "+20"
 *                 phone_number: "1000000000"
 *                 phone_verified_at: 2026-04-20T10:00:00.000Z
 *                 type: user
 *       400:
 *         description: Validation error or invalid OTP.
 */

/**
 * @swagger
 * /client/profile/phone/send-otp:
 *   post:
 *     tags: [Clients]
 *     summary: Send client phone verification OTP
 *     description: "Step 1 for changing a client phone number. In local development the OTP is static: 123456 and is returned in the response."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Phone verification OTP sent successfully
 *               data:
 *                 country_code: "+20"
 *                 phone_number: "1000000000"
 *                 otp: "123456"
 *       400:
 *         description: Validation error.
 */

/**
 * @swagger
 * /client/profile/phone/verify:
 *   put:
 *     tags: [Clients]
 *     summary: Verify and update client phone number
 *     description: "Step 2 for changing a client phone number. Send the phone number and OTP, then the API updates the account phone fields."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneVerificationRequest'
 *     responses:
 *       200:
 *         description: Phone verified and updated.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Phone number verified and updated successfully
 *               data:
 *                 id: 1
 *                 country_code: "+20"
 *                 phone_number: "1000000000"
 *                 phone_verified_at: 2026-04-20T10:00:00.000Z
 *                 type: client
 *       400:
 *         description: Validation error or invalid OTP.
 */

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     tags: [Auth]
 *     summary: Create a password reset code
 *     description: Use this on the forgot-password screen to request a reset code for a user or client account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, type]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               type:
 *                 type: string
 *                 enum: [user, client]
 *                 example: user
 *     responses:
 *       200:
 *         description: Password reset code created.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Password reset code created successfully
 *               data:
 *                 email: ahmed@example.com
 *                 type: user
 *                 code: "123456"
 *                 expires_in_minutes: 15
 *       404:
 *         description: Account not found.
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using a code
 *     description: Use this after the user enters the reset code and new password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, type, code, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               type:
 *                 type: string
 *                 enum: [user, client]
 *                 example: user
 *               code:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Password reset successfully
 *       400:
 *         description: Invalid or expired code.
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get my user profile
 *     description: Use this on the authenticated student profile edit page to load the current profile data.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 user_id: 1
 *                 skills: [node, mysql]
 *                 speciality: backend
 *                 university: Cairo University
 *                 college: Faculty of Computers and Artificial Intelligence
 *                 study_years: 2019-2023
 *                 date_of_birth: 2001-05-15
 *                 address: Cairo, Egypt
 *                 languages: [Arabic, English]
 *                 brief: Backend developer focused on Node.js and MySQL APIs.
 *                 profile_picture_url: https://example.com/uploads/profile.jpg
 *   put:
 *     tags: [Users]
 *     summary: Update my user profile
 *     description: "Use this when a student saves profile details. This is a partial update, so send only the fields that changed. Phone fields are not accepted here; use POST /user/profile/phone/send-otp then PUT /user/profile/phone/verify."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Profile updated successfully
 *               data:
 *                 user:
 *                   id: 1
 *                   first_name: Ahmed
 *                   last_name: Ali
 *                 profile:
 *                   user_id: 1
 *                   skills: [node, mysql]
 *                   speciality: backend
 *                   university: Cairo University
 *                   college: Faculty of Computers and Artificial Intelligence
 *                   study_years: 2019-2023
 */

/**
 * @swagger
 * /user/profile-picture:
 *   put:
 *     tags: [Users]
 *     summary: Update profile picture
 *     description: "Use this to upload a student profile image directly to the API. The file is validated as JPG, PNG, or WEBP, must be 2MB or smaller, then is exposed through the static /uploads/profile-pictures path."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProfilePictureRequest'
 *     responses:
 *       200:
 *         description: Profile picture updated.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Profile picture updated successfully
 *               data:
 *                 profile:
 *                   user_id: 1
 *                   profile_picture_url: http://localhost:3003/uploads/profile-pictures/profile.jpg
 *                 file:
 *                   url: http://localhost:3003/uploads/profile-pictures/profile.jpg
 *                   path: /uploads/profile-pictures/profile.jpg
 *                   mime_type: image/jpeg
 *                   size: 132456
 *       400:
 *         description: Missing or invalid image file.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Profile picture must be a JPG, PNG, or WEBP image
 */

/**
 * @swagger
 * /user/profiles/{user_id}:
 *   get:
 *     tags: [Users]
 *     summary: Get public user profile
 *     description: Use this on public student profile pages or when a client reviews applicants.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Public profile.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: 1
 *                   first_name: Ahmed
 *                   email: ahmed@example.com
 *                 profile:
 *                   speciality: backend
 *                   skills: [node]
 *                   profile_picture_url: https://example.com/uploads/profile.jpg
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List matching jobs
 *     description: Use this in the student job feed. It returns only open jobs that match the student's saved speciality.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matching open jobs.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   title: Build API
 *                   speciality: backend
 *                   status: open
 */

/**
 * @swagger
 * /user/offers:
 *   get:
 *     tags: [Jobs]
 *     summary: List my offers
 *     description: Use this in the student dashboard to show offers the student has sent and their current status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers sent by the authenticated user.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   job_id: 1
 *                   status: pending
 */

/**
 * @swagger
 * /user/jobs/{job_id}/offers:
 *   post:
 *     tags: [Jobs]
 *     summary: Apply to job
 *     description: Use this on the job details page when a student submits an offer with budget and estimated delivery time.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferRequest'
 *     responses:
 *       201:
 *         description: Offer sent.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Offer sent successfully
 *               data:
 *                 id: 1
 *                 job_id: 1
 *                 status: pending
 */

/**
 * @swagger
 * /user/jobs/{job_id}/submit-completion:
 *   post:
 *     tags: [Jobs]
 *     summary: Submit job completion files
 *     description: Use this when the assigned student uploads final deliverables for review.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompletionRequest'
 *     responses:
 *       200:
 *         description: Completion files submitted.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Completion files submitted successfully
 *               data:
 *                 job:
 *                   id: 1
 *                   status: in_progress
 *                 attachments:
 *                   - id: 1
 *                     file_name: final.zip
 */

/**
 * @swagger
 * /user/jobs/{job_id}/approve-completion:
 *   post:
 *     tags: [Jobs]
 *     summary: User approves completion
 *     description: Use this when the student confirms the submitted work should be considered complete; completion is final only after client approval too.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Completion approved by user.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Job completion approved successfully
 *               data:
 *                 id: 1
 *                 status: completed
 */

/**
 * @swagger
 * /client/:
 *   get:
 *     tags: [Clients]
 *     summary: Client index
 *     description: Use this only as a simple client-route smoke test.
 *     responses:
 *       200:
 *         description: Client API plain text response.
 *         content:
 *           text/plain:
 *             example: client API
 */

/**
 * @swagger
 * /client/profile:
 *   get:
 *     tags: [Clients]
 *     summary: Get client profile
 *     description: Use this on the authenticated client company profile screen.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client profile.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 company_name: Skill Link
 *   put:
 *     tags: [Clients]
 *     summary: Update client profile
 *     description: "Use this when a client updates their company profile. This is a partial update. Phone fields are not accepted here; use POST /client/profile/phone/send-otp then PUT /client/profile/phone/verify."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientProfileRequest'
 *     responses:
 *       200:
 *         description: Client profile updated.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Client profile updated successfully
 *               data:
 *                 id: 1
 *                 company_name: Skill Link
 */

/**
 * @swagger
 * /client/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create job
 *     description: Use this from the client job-posting form. Jobs start as public/open until an offer is accepted.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRequest'
 *     responses:
 *       201:
 *         description: Job created.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Job created successfully
 *               data:
 *                 id: 1
 *                 title: Build API
 *                 status: open
 *   get:
 *     tags: [Jobs]
 *     summary: List client jobs
 *     description: Use this in the client dashboard to show all jobs posted by the authenticated client.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client jobs.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   title: Build API
 *                   status: open
 */

/**
 * @swagger
 * /client/jobs/{job_id}/offers:
 *   get:
 *     tags: [Jobs]
 *     summary: List offers for job
 *     description: Use this on the client job details page to review students' offers for one job.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offers for the job.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   job_id: 1
 *                   user_id: 1
 *                   status: pending
 */

/**
 * @swagger
 * /client/offers/{offer_id}/accept:
 *   post:
 *     tags: [Jobs]
 *     summary: Accept offer
 *     description: Use this when a client accepts a student offer. It holds funds from the client wallet, hides the job from public listings, rejects other pending offers, and creates a chat room.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offer_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offer accepted and funds held.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Offer accepted successfully
 *               data:
 *                 job:
 *                   id: 1
 *                   status: in_progress
 *                 offer:
 *                   id: 1
 *                   status: accepted
 *                 chat_room:
 *                   id: 1
 */

/**
 * @swagger
 * /client/jobs/{job_id}/approve-completion:
 *   post:
 *     tags: [Jobs]
 *     summary: Client approves completion
 *     description: Use this when the client approves submitted final files. If the student has also approved, funds are released to the student's wallet.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Completion approved by client.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Job completion approved successfully
 *               data:
 *                 id: 1
 *                 status: completed
 */

/**
 * @swagger
 * /chats:
 *   get:
 *     tags: [Chats]
 *     summary: List chat rooms
 *     description: Use this in the chat inbox for either authenticated clients or students.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat rooms.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   job_id: 1
 */

/**
 * @swagger
 * /chats/{chat_room_id}/tasks:
 *   get:
 *     tags: [Chats]
 *     summary: List chat tasks
 *     description: Use this in the chat room task panel to display todo items for a job conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat tasks.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   title: Review final files
 *                   status: todo
 *   post:
 *     tags: [Chats]
 *     summary: Create chat task
 *     description: Use this to add a todo item inside an accepted job chat room.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatTaskRequest'
 *     responses:
 *       201:
 *         description: Task created.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Task created successfully
 *               data:
 *                 id: 1
 *                 title: Review final files
 *                 status: todo
 */

/**
 * @swagger
 * /chats/tasks/{task_id}:
 *   put:
 *     tags: [Chats]
 *     summary: Update chat task status
 *     description: Use this when a user marks a chat task as todo or done.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatTaskStatusRequest'
 *     responses:
 *       200:
 *         description: Task updated.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Task updated successfully
 *               data:
 *                 id: 1
 *                 status: done
 */

/**
 * @swagger
 * /chats/{chat_room_id}/attachments:
 *   get:
 *     tags: [Chats]
 *     summary: List chat attachments
 *     description: Use this to show all files shared inside an accepted job chat room.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat attachments.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   file_name: notes.pdf
 *                   purpose: chat
 *   post:
 *     tags: [Chats]
 *     summary: Create chat attachment
 *     description: Use this after uploading a file elsewhere to attach its URL to a chat room.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttachmentRequest'
 *     responses:
 *       201:
 *         description: Attachment created.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Attachment created successfully
 *               data:
 *                 id: 1
 *                 file_name: notes.pdf
 */

/**
 * @swagger
 * /payments/wallet:
 *   get:
 *     tags: [Payments]
 *     summary: Get wallet
 *     description: Use this anywhere the frontend needs to show wallet balance and held balance for the authenticated account.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 balance: "500.00"
 *                 held_balance: "0.00"
 */

/**
 * @swagger
 * /payments/top-up:
 *   post:
 *     tags: [Payments]
 *     summary: Top up wallet
 *     description: Use this in wallet funding screens. It uses the sudo payment gateway now and can be swapped for a real gateway later.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TopUpRequest'
 *     responses:
 *       200:
 *         description: Wallet topped up.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Wallet topped up successfully
 *               data:
 *                 payment:
 *                   status: paid
 *                   transaction_id: sudo_123
 *                 wallet:
 *                   balance: "500.00"
 */

/**
 * @swagger
 * /docs:
 *   get:
 *     tags: [Docs]
 *     summary: Swagger UI
 *     description: Use this in the browser to explore the API visually.
 *     responses:
 *       200:
 *         description: Swagger UI HTML.
 * /docs.json:
 *   get:
 *     tags: [Docs]
 *     summary: Raw OpenAPI JSON
 *     description: Use this if another tool needs the generated OpenAPI JSON document.
 *     responses:
 *       200:
 *         description: OpenAPI JSON document.
 *         content:
 *           application/json:
 *             example:
 *               openapi: 3.0.0
 *               info:
 *                 title: SkillLink API
 */
