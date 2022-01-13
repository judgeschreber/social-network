const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const compression = require("compression");
const path = require("path");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");
const db = require("./db.js");
const s3 = require("./s3.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { sendEmail } = require("./ses");

const cryptoRandomString = require("crypto-random-string");

const sessionSecret =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(
    cookieSession({
        secret: sessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

app.use(compression());

app.use(express.json({ limit: "25mb" }));

app.use(express.static(path.join(__dirname, "..", "client", "public")));

//REGISTER
app.post("/registration.json", function (req, res) {
    console.log("a post request has been made, req.body: ", req.body);
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.password;

    if (
        req.body.password != "" &&
        req.body.first != "" &&
        req.body.last != "" &&
        req.body.email != ""
    ) {
        hash(password)
            .then((hashedPw) => {
                return db.addUserData(first, last, email, hashedPw);
            })
            .then((result) => {
                req.session.userId = result[0].id;
                res.json(result);
            })
            .catch((err) => {
                console.log("err in POST register hash", err);
                // don't forget to send a type of response
                res.json({
                    error: true,
                });
            });
    } else {
        res.render("/");
    }
});

//LOGIN
app.post("/login.json", (req, res) => {
    const email = req.body.email;
    db.getHashPw(email)
        .then((result) => {
            const hashPw = result[0].password;
            Promise.all([compare(req.body.password, hashPw), db.getID(email)])
                .then((resultArr) => {
                    if (resultArr[0] == true) {
                        req.session.userId = resultArr[1][0].id;
                        res.json({
                            userId: req.session.userId,
                        });
                    } else {
                        console.log(
                            "result in else: ",
                            resultArr,
                            "password: ",
                            req.body.password
                        );
                    }
                })
                .catch((err) => {
                    console.log("error in login: ", err);
                });
        })
        .catch(() => {
            console.log("err in getHashPw: ", res.success);
            return res.json({
                error: true,
            });
        });
});

app.post("/sendEmail.json", (req, res) => {
    const randomString = cryptoRandomString({
        length: 10,
    });
    const email = req.body.email;
    const subject = "Your reset code!";
    const message = `Your reset code is ${randomString}`;

    //dbquery if mail exists in db
    db.searchEmail(email)
        .then((result) => {
            if (result.length > 0) {
                sendEmail(email, subject, message);
            } else {
                console.log("No email found!");
            }
        })
        .then(() => {
            db.insertResetCode(email, randomString);
        });
});

//user has received email and enters his code
app.post("/resetPassword.json", (req, res) => {
    //receive email, recovery code and new password:
    const password = req.body.password;
    const code = req.body.code;
    const mail = req.body.email;
    //db query: check if there is a email and code match
    db.validateInputCode(mail).then((result) => {
        if (result[0].code == code) {
            hash(password).then((password) => {
                db.resetPassword(password, mail);
            });
        } else {
            console.log("no match in reset_codes!!!!", result[0].code);
        }
    });
});

//Upload Photo route:

app.post("/upload.json", uploader.single("file"), s3.upload, (req, res) => {
    const filename = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    const id = req.session.userId;
    //db query: insert imageUrl to db and return imageUrl
    db.upsertProfilePic(filename, id).then((result) => {
        res.json({
            url: result[0].image_url,
        });
    });

    //send back imageUrl to fetch in uploader
});

//get imageUrl by ID
app.get("/getUserData", (req, res) => {
    const id = req.session.userId;

    db.getUserData(id).then((result) => {
        return res.json(result[0]);
    });
});

//submitBio
app.post("/bio.json", (req, res) => {
    const bio = req.body.bio;
    const id = req.session.userId;
    db.updateBio(bio, id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("something went wrong in bio.json, ", err);
        });
});

//getPeople
app.get("/getpeople", (req, res) => {
    db.getThreePeople()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("err in getpeople ", err);
        });
});

//findpeople

app.post("/findpeople.json", (req, res) => {
    const searchterm = req.body.searchterm;
    console.log(
        "fetch request made from find people component SEARCH, ",
        req.body
    );
    db.findPeople(searchterm)
        .then((result) => {
            console.log("we got results from findPeople, ", result);
            res.json(result);
        })
        .catch((err) => {
            console.log("err in getpeople ", err);
        });
});

//get other user data

app.get("/otheruser/:id", (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;
    if (userId == id) {
        return res.json({ redirect: true });
    }
    db.getUserData(id)
        .then((result) => {
            if (result.length > 0) {
                return res.json(result[0]);
            } else {
                return res.json({ notfound: true });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

//check friendship status in friendbutton.js

app.get("/friendship-status/:userId", (req, res) => {
    const viewdId = req.params.userId;
    const loggedInId = req.session.userId;
    db.checkFriendship(loggedInId, viewdId)
        .then((results) => {
            if (results.length == 0) {
                res.json({ noRelation: true });
            }
            res.json(results[0]);
        })
        .catch((err) => console.log(err));
});

//make friend request

app.post("/friend-request/:userId", (req, res) => {
    const viewdId = req.params.userId;
    const loggedInId = req.session.userId;

    //db insert
    db.addFriendRelation(loggedInId, viewdId).then(() => {
        res.json({ success: true });
    });
});

//accept friend

app.post("/friend-accept/:userId", (req, res) => {
    const viewdId = req.params.userId;
    const loggedInId = req.session.userId;

    db.acceptFriend(loggedInId, viewdId).then(() => {
        return res.json({ success: true });
    });
});

// delete friend

app.post("/friend-delete/:userId", (req, res) => {
    const viewdId = req.params.userId;
    const loggedInId = req.session.userId;

    db.deleteFriend(loggedInId, viewdId).then(() => {
        return res.json({ success: true });
    });
});

// REDUX get friends and Wannabes:
app.get("/friendsAndWannabes", (req, res) => {

    const id = req.session.userId;

    db.getFriendsAndWannbes(id).then((results) => {
        res.json(results);
    });
});

//send Doodle

app.post("/send-doodle/:receiverId", (req, res) => {
    const receiverId = req.params.receiverId;
    const senderId = req.session.userId;
    const imageUrl = req.body.imageUrl;
    db.addDoodle(senderId, receiverId, imageUrl).then(() => {
        db.getDoodles(receiverId).then((results) => {
            res.json(results);
        });
    });
});

//get doodles

app.get("/doodles/:id?", (req, res) => {
    let userId;
    if (req.params.id) {
        userId = req.params.id;
    } else {
        userId = req.session.userId;
    }

    db.getDoodles(userId).then((results) => {
        res.json(results);
    });
});

//logout

app.get("/logout", (req, res) => {
  
    req.session.userId = null;
    res.redirect("/");
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
});

io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    /* get last 10 chat messages from DB / emit them to user who just connected: soccet.emit()
    NEW table in DB for messages 
    */
    db.getLastTenMessages()
        .then((results) => {
            socket.emit("chatMessages", results);
        })
        .catch(console.log);

    socket.on("newChatMessage", (message) => {
        //1. insert into db
        db.addMessage(userId, message).then(() => {
            db.getMessage(userId).then((result) => {

                io.emit("chatMessage", result[0]);
            });
        });
    
    });
});
