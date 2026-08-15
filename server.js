import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import path from "node:path";
import { authRouter } from "./routes/auth.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();
const PORT = 8000;
const secret = process.env.CHEFBASE_SECRET;

app.use(express.json());

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);
app.use(express.static("public"));

// 404 Not Found catch-all handler
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.status(404).sendFile(path.join(path.resolve(), "public", "404.html"));
});

app
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
