import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPriorityNotifications } from "./services/notificationService";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/priority-notifications", async (_, res) => {
  const data = await getPriorityNotifications(10);
  res.json(data);
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});