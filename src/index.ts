
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRouter from "./routes/auth_routes";
import userRouter from "./routes/user_routes";
import errorHandler from "./middleware/error_handler";
import { apiKeyAuth } from "./util/api_key"
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config();

const port = process.env.PORT || 8080;


const app = express();

// CORS configuration
const corsOptions = {
   origin: [
      'http://localhost:3000',     // Assuming your friend uses port 3000
      'http://localhost:5173',     // In case they're using Vite's default port
      // Add any other frontend URLs that need access
   ],
   credentials: true,             // This allows cookies to be sent with requests
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Add any other headers you're using
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.get('/api/V0/dummy', (req, res) => {
   res.json({
      message: "tst1"
   });
});
app.use("/api/V0/", apiKeyAuth, authRouter);
app.use("/api/V0/", apiKeyAuth, userRouter);
app.use(errorHandler);
export default app;