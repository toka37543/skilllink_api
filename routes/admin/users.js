const express = require('express');
const app   = express();
const db = require('../../lib/db');

app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const results = await db.execute(query);
        return res.send({
            success: true,
            data: results[0]
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while fetching users.'
        });
    }
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const results = await db.execute(query, [id]);
        if (results[0].length === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found.'
            });
        }
        return res.send({
            success: true,
            data: results[0]
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while fetching the user.'
        });
    }   

});

module.exports = app;