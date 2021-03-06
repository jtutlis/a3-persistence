const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const http = require("http");
const path = require("path");
const passportSetup = require("./config/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const cookieKey =
    process.env.NODE_ENV === "production"
        ? process.env.cookieKey
        : config.get("cookieKey");

app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [cookieKey],
    })
);

// init passport
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);

// set up database
const db =
    process.env.NODE_ENV === "production"
        ? process.env.mongoURI
        : config.get("mongoURI");
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));

// // Sets up routes
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/movie"));

// production only
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));
