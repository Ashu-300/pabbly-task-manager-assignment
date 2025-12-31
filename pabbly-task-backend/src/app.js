const express = require("express");
const {connectDB} = require('./config/db')
const {authRouter} = require("./routes/auth.routes");
const {taskRouter} = require("./routes/task.routes");
const {userRouter} = require("./routes/user.routes");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

connectDB()

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true
  })
);
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = {app};
