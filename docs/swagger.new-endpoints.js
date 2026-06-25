/**
 * Swagger annotations for the endpoints added after the first release:
 * single job details, saved jobs, reports, notifications, and chat messages.
 * swagger-jsdoc picks this file up automatically (see lib/swagger.js).
 */

/**
 * @swagger
 * /user/jobs/{job_id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get a single job's details (freelancer view)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Job details, including a `saved` flag for the current user }
 *       404: { description: Job not found }
 */

/**
 * @swagger
 * /user/saved-jobs:
 *   get:
 *     tags: [Saved jobs]
 *     summary: List the freelancer's saved jobs
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of saved job objects }
 * /user/jobs/{job_id}/save:
 *   post:
 *     tags: [Saved jobs]
 *     summary: Save (bookmark) a job
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201: { description: Job saved }
 *       404: { description: Job not found }
 *   delete:
 *     tags: [Saved jobs]
 *     summary: Remove a job from the saved list
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Job unsaved }
 */

/**
 * @swagger
 * /client/saved-jobs:
 *   get:
 *     tags: [Saved jobs]
 *     summary: List the client's saved jobs
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of saved job objects }
 * /client/jobs/{job_id}/save:
 *   post:
 *     tags: [Saved jobs]
 *     summary: Save (bookmark) a job (client side)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201: { description: Job saved }
 *   delete:
 *     tags: [Saved jobs]
 *     summary: Unsave a job (client side)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Job unsaved }
 */

/**
 * @swagger
 * /user/reports:
 *   get:
 *     tags: [Reports]
 *     summary: List the freelancer's submitted reports
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of reports }
 *   post:
 *     tags: [Reports]
 *     summary: Submit a support/issue report
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               issue_type: { type: string, example: technical }
 *               description: { type: string }
 *               attachment_url: { type: string }
 *     responses:
 *       201: { description: Report submitted }
 *       400: { description: Validation error }
 */

/**
 * @swagger
 * /client/reports:
 *   get:
 *     tags: [Reports]
 *     summary: List the client's submitted reports
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of reports }
 *   post:
 *     tags: [Reports]
 *     summary: Submit a support/issue report (client side)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               issue_type: { type: string }
 *               description: { type: string }
 *               attachment_url: { type: string }
 *     responses:
 *       201: { description: Report submitted }
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List the current account's notifications
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Notifications plus an unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items: { type: array, items: { type: object } }
 *                     unread_count: { type: integer }
 * /notifications/{id}/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Marked as read }
 *       404: { description: Notification not found }
 */

/**
 * @swagger
 * /chats/{chat_room_id}/messages:
 *   get:
 *     tags: [Chats]
 *     summary: List messages in a chat room (also marks them read)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Array of messages, oldest first }
 *       404: { description: Chat room not found }
 *   post:
 *     tags: [Chats]
 *     summary: Send a message in a chat room
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body: { type: string, example: "Hi, when can you start?" }
 *               text: { type: string, description: "Alias for body" }
 *     responses:
 *       201: { description: Message sent }
 *       404: { description: Chat room not found }
 */
