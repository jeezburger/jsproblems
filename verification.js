//enter username and pw. get a token. use that token to verify yourself and get a list of other users.

const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();
app.use(express.json())
const ALL_USERS = [
    {
        username: "harkirat@gmail.com",
        password: "123",
        name: "harkirat singh",
    },
    {
        username: "raman@gmail.com",
        password: "123321",
        name: "Raman singh",
    },
    {
        username: "priya@gmail.com",
        password: "123321",
        name: "Priya kumari",
    },
];

function userExists(username, password) {
    // write logic to return true or false if this user exists
    // in ALL_USERS array
    let userExists = false;
    for (let i = 0; i < ALL_USERS.length; i++) {
        if (ALL_USERS[i].username == username && ALL_USERS[i].password == password) {
            userExists = true;
        }
    }
    return userExists;
}

app.post("/signin", function (req, res) {
    const username = req.body.username;           //this username variable is the one we requested token of.
    const password = req.body.password;

    if (!userExists(username, password)) {
        return res.status(403).json({
            msg: "User doesnt exist in our in memory db",
        });
    }

    var token = jwt.sign({ username: username }, jwtPassword); //takes username and the jwt pw as input for the sign (signature) function
    return res.json({
        token,
    });
});

app.get("/users", function (req, res) {
    const token = req.headers.authorization;    //put harkirat's gmail's signin token here
    try {   //"try" doing this. if doesn't work (token of wrong format) then "catch" the error and return what's in catch
        const decoded = jwt.verify(token, jwtPassword);   //jwt.verify verifies that it's harkirat's token, decodes it and stores it in decoded
        const username = decoded.username;                //username stores harkirat's username decoded from the token
        // return a list of users other than this username
        res.json({                       //if the token if valid and the signin is verified, the user gets to see all users except himself
            users: ALL_USERS.filter(function (value) {
                if (value.username == username) {
                    return false;
                }
                else {
                    return true;
                }
            })
        })
    } catch (err) {        //if the verifiation fails it comes here.
        return res.status(403).json({
            msg: "Invalid token",
        });
    }
});

app.listen(3000)
