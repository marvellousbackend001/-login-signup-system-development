const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const saltRounds = 10;
const app = express();
/****************Connecting To  Mysql************************* */
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "CHIDERA001?.1",
    database: "auth",
    port: "3306",
});
con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
})
//creating an endpoint that handles users registration
app.post("/signup", bodyParser.json(), function (req, res) {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw err;
        const sql = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;
        con.query(sql, [username, email, hash], function (err, result) {
            if (err) throw err;
            res.send("registered");
        });
    });
});
//creating an endpoint that handles users login
app.post("/login", bodyParser.json(), function (req, res) {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    con.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // Implement session management here
                    res.send("Logged in");
                } else {
                    res.send("Incorrect password");
                }
            });
        } else {
            res.send("User not found");
        }
    });
});
// Implenting my routes 
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});