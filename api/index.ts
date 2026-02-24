import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { handleUpload } from "../server/uploadHandler";
import { generateRSSFeed, generateAtomFeed } from "../server/rss";

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);

// Upload API
app.post("/api/upload", handleUpload);

// RSS Feed
app.get("/api/rss", async (req, res) => {
  try {
    const rss = await generateRSSFeed();
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.send(rss);
  } catch (error) {
    console.error("RSS feed generation error:", error);
    res.status(500).send("Error generating RSS feed");
  }
});

// Atom Feed
app.get("/api/atom", async (req, res) => {
  try {
    const atom = await generateAtomFeed();
    res.setHeader("Content-Type", "application/atom+xml; charset=utf-8");
    res.send(atom);
  } catch (error) {
    console.error("Atom feed generation error:", error);
    res.status(500).send("Error generating Atom feed");
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
