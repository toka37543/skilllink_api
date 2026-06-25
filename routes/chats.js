const express = require("express");
const app = express();
const chatController = require("../controllers/chat.controller");
const { requireAuth } = require("../middleware/auth");

app.get("/chats", requireAuth, chatController.listRooms);

app.get("/chats/:chat_room_id/tasks", requireAuth, chatController.listTasks);

app.post("/chats/:chat_room_id/tasks", requireAuth, chatController.createTask);

app.put("/chats/tasks/:task_id", requireAuth, chatController.updateTask);

app.get("/chats/:chat_room_id/attachments", requireAuth, chatController.listAttachments);

app.post("/chats/:chat_room_id/attachments", requireAuth, chatController.createAttachment);

app.get("/chats/:chat_room_id/messages", requireAuth, chatController.listMessages);

app.post("/chats/:chat_room_id/messages", requireAuth, chatController.createMessage);

module.exports = app;
