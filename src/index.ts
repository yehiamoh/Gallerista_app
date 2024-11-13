
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRouter from "./routes/auth_routes";
import userRouter from "./routes/user_routes";
import boardRouter from "./routes/board_routes";
import errorHandler from "./middleware/error_handler";
import { apiKeyAuth } from "./util/api_key"
import cookieParser from "cookie-parser";
import cors from "cors"
import followRouter from "./routes/follow_routes";
dotenv.config();

const port = process.env.PORT || 8080;


const app = express();

// CORS configuration
const corsOptions = {
   origin: [
      'http://localhost:3000',     // Assuming your friend uses port 3000
      'http://localhost:5173', 
      'https://gallery-git-main-fadys-projects-ce6c30fb.vercel.app',  
      'https://gallery-xh7a.vercel.app',
      'https://gallery-fadys-projects-ce6c30fb.vercel.app',
      'https://gallery-gilt-kappa.vercel.app/?vercelToolbarCode=Bf2y6VJI3aOBcKT',
      'https://gallery-git-main-fadys-projects-ce6c30fb.vercel.app/?vercelToolbarCode=PId5OuAjBPc9UlD',
      'https://gallery-ln0zbjipd-fadys-projects-ce6c30fb.vercel.app/?vercelToolbarCode=23mKcphaOmjAoow',
      'http://gallery-gilt-kappa.vercel.app',
      

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
app.use("/api/V0/", apiKeyAuth, boardRouter);
app.use("/api/V0/", apiKeyAuth, followRouter);
app.use(errorHandler);
export default app;