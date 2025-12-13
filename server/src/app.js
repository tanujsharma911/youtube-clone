import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import pkg from 'express-openid-connect';
// const { auth, requiresAuth } = pkg;

dotenv.config();

// Initialize Express App
const app = express();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: `${process.env.AUTH0_SECRET_KEY}`,
    baseURL: `http://localhost:${process.env.PORT || 8000}`,
    clientID: 'iIoNs5oGXJUhpwxU0fHSzRxjRXjetcIM',
    issuerBaseURL: 'https://dev-tlhxpcz3x0cr3z15.us.auth0.com'
};

console.log("Auth0 Config:", config);

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));



// Body Parsers
app.use(express.json({ limit: '100kb' }));
app.use(urlencoded({ extended: true, limit: '100kb' }));
app.use(express.static('public'));

app.use(cookieParser());


// Authentication Middleware
// import authRouter from "./routes/auth.route.js";
// app.use("/", authRouter);
// app.get('/', (req, res) => {
//     if(req.oidc.isAuthenticated()) {
//         res.status(200).json({ status: 200, message: 'Logged in', user: req.oidc.user });
//     } else {
//         res.status(401).json({ status: 401, message: 'Logged out' });
//     }
// });
// app.get('/profile', requiresAuth(), (req, res) => {
//     res.status(200).json(req.oidc.user);
// });


// Routes
import userRoutes from "./routes/user.route.js";
import healthChecker from "./routes/health.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";
import interactionRouter from "./routes/interaction.route.js";

// Routes Declaration
app.use("/api/health", healthChecker);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRouter);
app.use("/api/comments", commentRouter);
app.use("/api/interaction", interactionRouter);

export default app;