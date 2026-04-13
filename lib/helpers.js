function stringifyJson(value) {
  return value == null ? null : JSON.stringify(value);
}

function parseJson(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

function serializeJsonFields(row, fields) {
  if (!row) {
    return null;
  }

  const serialized = { ...row };

  fields.forEach((field) => {
    serialized[field] = parseJson(serialized[field]);
  });

  return serialized;
}

function getAccountModel(type) {
  const User = require("../models/user.model");
  const Client = require("../models/client.model");

  const accountModels = {
    user: User,
    client: Client
  };

  return accountModels[type] ?? null;
}

async function findAccountByEmail(type, email, connection) {
  const Account = getAccountModel(type);

  if (!Account) {
    return null;
  }

  return Account.findByEmail(email, connection);
}

async function findAccountById(type, id, connection) {
  const Account = getAccountModel(type);

  if (!Account) {
    return null;
  }

  return Account.findById(id, connection);
}

async function updateAccountPassword(type, email, password, connection) {
  const Account = getAccountModel(type);

  if (!Account) {
    throw new Error("Invalid account type");
  }

  return Account.updatePassword(email, password, connection);
}

function createPasswordCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = {
  stringifyJson,
  parseJson,
  serializeJsonFields,
  getAccountModel,
  findAccountByEmail,
  findAccountById,
  updateAccountPassword,
  createPasswordCode
};
