import axios from "axios";

const weights: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export async function getPriorityNotifications(limit: number) {
  const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    }
  );

  const notifications = response.data.notifications;

  const scored = notifications.map((item: any) => ({
    ...item,
    score:
      weights[item.Type] * 1000000000 +
      new Date(item.Timestamp).getTime()
  }));

  scored.sort((a: any, b: any) => b.score - a.score);

  return scored.slice(0, limit);
}