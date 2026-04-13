const User = require("../models/user.model");

async function listUsers(req, res) {
  try {
    return res.send({
      success: true,
      data: await User.list()
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching users."
    });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found."
      });
    }

    return res.send({
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching the user."
    });
  }
}

module.exports = {
  listUsers,
  getUserById
};
