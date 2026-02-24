import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { handleUpload } from "../uploadHandler";
import { generateRSSFeed, generateAtomFeed } from "../rss";
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerOAuthRoutes(app);
app.post("/api/upload", handleUpload);
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
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
export default app;
