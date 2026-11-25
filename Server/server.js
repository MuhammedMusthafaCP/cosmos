const config = require("./config/env");
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { createServer } = require("http");

const setupSocket = require("./socketio");
const connectDB = require("./config/connect");
const userrouter = require("./Routes/user");
const postrouter = require("./Routes/post");
const authrouter = require("./GoogleAuth/auth");
const communityrouter = require("./Routes/community");
const chatrouter = require("./Routes/chat");
const newsrouter = require("./Routes/news");
const reviewrouter = require("./Routes/reviews");
const { startScheduler } = require("./jobs/scheduler");
const cookieParser = require('cookie-parser')
const app = express();
const dbReady = connectDB();
require("./GoogleAuth/GoogleAuth");


const server = createServer(app);
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.clientOrigins,
    credentials: true,
  })
);

app.set("io", setupSocket(server));

app.use("/users", userrouter);
app.use("/posts", postrouter);
app.use("/auth", authrouter);
app.use("/community", communityrouter);
app.use("/chat", chatrouter);
app.use("/news", newsrouter);
app.use("/review", reviewrouter);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} (${config.nodeEnv})`);
});

// Daily news / picture-of-the-day sync + cleanup. Starts once the database is connected.
dbReady.then(startScheduler).catch((error) => console.error("[jobs] scheduler failed to start:", error));