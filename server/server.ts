import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhook.js";

const app = express();

// connect to mongodb
await connectDb();

app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
