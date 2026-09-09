const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const users = [];


/* REGISTER */

app.post("/api/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            success:false,
            message:"Username aur password required hai"
        });

    }

    const exists = users.find(
        user => user.username === username
    );

    if (exists) {

        return res.json({
            success:false,
            message:"Username already registered hai"
        });

    }

    users.push({
        username,
        password
    });

    console.log("NEW USER:", username);

    res.json({
        success:true,
        message:"Registration successful"
    });

});


/* LOGIN */

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    const user = users.find(
        u =>
        u.username === username &&
        u.password === password
    );

    if (!user) {

        return res.json({
            success:false,
            message:"Wrong username ya password"
        });

    }

    res.json({
        success:true,
        message:"Login successful"
    });

});


app.use((req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


app.listen(PORT, () => {

    console.log(
        "BIRUXY DIGITAL SHOP running on port " + PORT
    );

});
