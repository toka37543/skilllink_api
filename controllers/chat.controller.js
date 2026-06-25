const joi = require("joi");
const ChatRoom = require("../models/chat-room.model");
const ChatTask = require("../models/chat-task.model");
const ChatAttachment = require("../models/chat-attachment.model");
const ChatMessage = require("../models/chat-message.model");
const Notification = require("../models/notification.model");

async function ensureChatAccess(chatRoomId, account) {
  const chatRoom = await ChatRoom.findById(chatRoomId);
  if (!chatRoom) {
    return null;
  }

  if (account.type === "client" && chatRoom.client_id !== account.id) {
    return null;
  }

  if (account.type === "user" && chatRoom.user_id !== account.id) {
    return null;
  }

  return chatRoom;
}

async function listRooms(req, res) {
  return res.send({
    success: true,
    data: await ChatRoom.listForAccount(req.account.type, req.account.id)
  });
}

async function listTasks(req, res) {
  const chatRoom = await ensureChatAccess(req.params.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(404).send({
      success: false,
      message: "Chat room not found"
    });
  }

  return res.send({
    success: true,
    data: await ChatTask.listByRoom(chatRoom.id)
  });
}

async function createTask(req, res) {
  const schema = joi.object({
    title: joi.string().required(),
    description: joi.string().optional()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const chatRoom = await ensureChatAccess(req.params.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(404).send({
      success: false,
      message: "Chat room not found"
    });
  }

  const task = await ChatTask.create(chatRoom.id, req.account, validation.value);

  return res.status(201).send({
    success: true,
    message: "Task created successfully",
    data: task
  });
}

async function updateTask(req, res) {
  const schema = joi.object({
    status: joi.string().valid("todo", "done").required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const task = await ChatTask.findById(req.params.task_id);
  if (!task) {
    return res.status(404).send({
      success: false,
      message: "Task not found"
    });
  }

  const chatRoom = await ensureChatAccess(task.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(403).send({
      success: false,
      message: "Forbidden"
    });
  }

  return res.send({
    success: true,
    message: "Task updated successfully",
    data: await ChatTask.updateStatus(task.id, validation.value.status)
  });
}

async function listAttachments(req, res) {
  const chatRoom = await ensureChatAccess(req.params.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(404).send({
      success: false,
      message: "Chat room not found"
    });
  }

  return res.send({
    success: true,
    data: await ChatAttachment.listByRoom(chatRoom.id)
  });
}

async function createAttachment(req, res) {
  const schema = joi.object({
    file_name: joi.string().required(),
    file_url: joi.string().required(),
    file_type: joi.string().optional(),
    purpose: joi.string().valid("chat", "completion").optional()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const chatRoom = await ensureChatAccess(req.params.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(404).send({
      success: false,
      message: "Chat room not found"
    });
  }

  const attachment = await ChatAttachment.create(chatRoom.id, req.account, validation.value);

  return res.status(201).send({
    success: true,
    message: "Attachment created successfully",
    data: attachment
  });
}

async function listMessages(req, res) {
  const chatRoom = await ensureChatAccess(req.params.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(404).send({
      success: false,
      message: "Chat room not found"
    });
  }

  // Opening the thread marks the other party's messages as read.
  await ChatMessage.markRoomReadFor(chatRoom.id, req.account);

  return res.send({
    success: true,
    data: await ChatMessage.listByRoom(chatRoom.id)
  });
}

async function createMessage(req, res) {
  const schema = joi.object({
    // Accept either `body` or `text` so the frontend can use either name.
    body: joi.string().min(1),
    text: joi.string().min(1)
  }).or("body", "text");

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const chatRoom = await ensureChatAccess(req.params.chat_room_id, req.account);
  if (!chatRoom) {
    return res.status(404).send({
      success: false,
      message: "Chat room not found"
    });
  }

  const body = validation.value.body ?? validation.value.text;
  const message = await ChatMessage.create(chatRoom.id, req.account, body);

  // Notify the other participant so their bell badge updates.
  const recipient = req.account.type === "client"
    ? { type: "user", id: chatRoom.user_id }
    : { type: "client", id: chatRoom.client_id };

  await Notification.create(recipient, {
    type: "chat_message",
    title: "New message",
    body: body.slice(0, 120),
    link: "/messages"
  });

  return res.status(201).send({
    success: true,
    message: "Message sent successfully",
    data: message
  });
}

module.exports = {
  listRooms,
  listTasks,
  createTask,
  updateTask,
  listAttachments,
  createAttachment,
  listMessages,
  createMessage
};
