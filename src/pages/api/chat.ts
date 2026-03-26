import { Redis } from "@upstash/redis";

export const prerender = false;

const redisUrl =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

export async function POST({
  request,
  clientAddress,
}: {
  request: Request;
  clientAddress: string;
}) {
  try {
    const ip =
      clientAddress || request.headers.get("x-forwarded-for") || "127.0.0.1";

    if (redis) {
      const key = `rate_limit_chat_${ip}`;
      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, 60); // 60 seconds window
      }

      if (requests > 10) {
        return new Response(
          JSON.stringify({
            text: "You've reached the API message limit! Please wait a minute before trying again.",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const webhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      "https://personaln8n.francismistica.me/webhook/kaiko-ai";

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`Webhook responded with status: ${res.status}`);
    }

    let botText = "";
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      botText =
        data.text ||
        data.output ||
        data.response ||
        data.message ||
        (Array.isArray(data)
          ? data[0].text || data[0].output || JSON.stringify(data[0])
          : JSON.stringify(data));
    } else {
      botText = await res.text();
    }

    return new Response(JSON.stringify({ text: botText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
