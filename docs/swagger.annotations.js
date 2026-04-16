/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
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
 *       required: [first_name, last_name, email, password, type]
 *       properties:
 *         first_name:
 *           type: string
 *           example: Ahmed
 *         last_name:
 *           type: string
 *           example: Ali
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
 *         country_code:
 *           type: string
 *           example: "+20"
 *         phone_number:
 *           type: string
 *           example: "1000000000"
 *         company_name:
 *           type: string
 *           example: Skill Link
 *         company_details:
 *           type: string
 *           example: Hiring company profile
 *     UserProfileRequest:
 *       type: object
 *       required: [speciality]
 *       properties:
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
 *     ClientProfileRequest:
 *       type: object
 *       required: [first_name, last_name]
 *       properties:
 *         first_name:
 *           type: string
 *           example: Sara
 *         last_name:
 *           type: string
 *           example: Hassan
 *         country_code:
 *           type: string
 *           example: "+20"
 *         phone_number:
 *           type: string
 *           example: "1000000000"
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
 *           minItems: 1
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
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: object
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
 *     responses:
 *       200:
 *         description: Plain text health response.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Invalid credentials.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a user or client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registered successfully.
 *       400:
 *         description: Validation or duplicate email error.
 */

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     tags: [Auth]
 *     summary: Create a password reset code
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
 *               type:
 *                 type: string
 *                 enum: [user, client]
 *     responses:
 *       200:
 *         description: Password reset code created.
 *       404:
 *         description: Account not found.
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using a code
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
 *               type:
 *                 type: string
 *                 enum: [user, client]
 *               code:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired code.
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get my user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile.
 *   put:
 *     tags: [Users]
 *     summary: Update my user profile
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
 */

/**
 * @swagger
 * /user/profiles/{user_id}:
 *   get:
 *     tags: [Users]
 *     summary: Get public user profile
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Public profile.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List open jobs matching the authenticated user's speciality
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matching open jobs.
 */

/**
 * @swagger
 * /user/offers:
 *   get:
 *     tags: [Jobs]
 *     summary: List my job offers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers sent by the authenticated user.
 */

/**
 * @swagger
 * /user/jobs/{job_id}/offers:
 *   post:
 *     tags: [Jobs]
 *     summary: Apply to a job by sending an offer
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
 */

/**
 * @swagger
 * /user/jobs/{job_id}/submit-completion:
 *   post:
 *     tags: [Jobs]
 *     summary: Submit completed files for a job
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
 */

/**
 * @swagger
 * /user/jobs/{job_id}/approve-completion:
 *   post:
 *     tags: [Jobs]
 *     summary: User approves job completion
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
 */

/**
 * @swagger
 * /client/:
 *   get:
 *     tags: [Clients]
 *     summary: Client index
 *     responses:
 *       200:
 *         description: Client API plain text response.
 */

/**
 * @swagger
 * /client/profile:
 *   get:
 *     tags: [Clients]
 *     summary: Get client profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client profile.
 *   put:
 *     tags: [Clients]
 *     summary: Update client profile
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
 */

/**
 * @swagger
 * /client/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create a job
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
 *   get:
 *     tags: [Jobs]
 *     summary: List jobs created by the authenticated client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client jobs.
 */

/**
 * @swagger
 * /client/jobs/{job_id}/offers:
 *   get:
 *     tags: [Jobs]
 *     summary: List offers for a client job
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
 */

/**
 * @swagger
 * /client/offers/{offer_id}/accept:
 *   post:
 *     tags: [Jobs]
 *     summary: Accept an offer and create a chat room
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
 */

/**
 * @swagger
 * /client/jobs/{job_id}/approve-completion:
 *   post:
 *     tags: [Jobs]
 *     summary: Client approves job completion
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
 */

/**
 * @swagger
 * /chats:
 *   get:
 *     tags: [Chats]
 *     summary: List chat rooms for the authenticated account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat rooms.
 */

/**
 * @swagger
 * /chats/{chat_room_id}/tasks:
 *   get:
 *     tags: [Chats]
 *     summary: List chat tasks
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
 *   post:
 *     tags: [Chats]
 *     summary: Create chat task
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
 */

/**
 * @swagger
 * /chats/tasks/{task_id}:
 *   put:
 *     tags: [Chats]
 *     summary: Update chat task status
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
 */

/**
 * @swagger
 * /chats/{chat_room_id}/attachments:
 *   get:
 *     tags: [Chats]
 *     summary: List chat attachments
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
 *   post:
 *     tags: [Chats]
 *     summary: Create chat attachment
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
 */

/**
 * @swagger
 * /payments/wallet:
 *   get:
 *     tags: [Payments]
 *     summary: Get authenticated account wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet.
 */

/**
 * @swagger
 * /payments/top-up:
 *   post:
 *     tags: [Payments]
 *     summary: Top up wallet through the sudo payment gateway
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
 */

/**
 * @swagger
 * /docs:
 *   get:
 *     tags: [Docs]
 *     summary: Swagger UI
 *     responses:
 *       200:
 *         description: Swagger UI HTML.
 * /docs.json:
 *   get:
 *     tags: [Docs]
 *     summary: Raw OpenAPI JSON
 *     responses:
 *       200:
 *         description: OpenAPI JSON document.
 */
