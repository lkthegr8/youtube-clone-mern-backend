import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  //   credentials: true,
};

// use method is a middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// used to store files publically i is exposed to the internet
app.use(express.static("public"));
// to access and change the cookie in the users browser, this cookie can only be accessed by the server
app.use(cookieParser());


// routes import
import userRoutes from "./routes/user.routes.js";

// routes declaration, to use routes you will insert it in middleware
app.use("/api/v1/users", userRoutes);
export { app };
