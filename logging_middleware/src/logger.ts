import axios from "axios";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];

export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
) {
  try {
    if (!validStacks.includes(stack.toLowerCase())) {
      throw new Error("Invalid stack");
    }

    if (!validLevels.includes(level.toLowerCase())) {
      throw new Error("Invalid level");
    }

    await axios.post(
      LOG_API,
      {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );
  } catch (error) {}
}