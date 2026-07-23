import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

const MAX_CLOCK_SKEW_SECONDS = 300;

export async function POST(request: Request) {
  const secret = process.env.FRAPPE_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const body = await request.text();
  const timestamp = request.headers.get("x-jcexport-timestamp") || "";
  const provided = request.headers
    .get("x-jcexport-signature")
    ?.replace(/^sha256=/, "") || "";
  const timestampNumber = Number(timestamp);
  if (
    !Number.isFinite(timestampNumber) ||
    Math.abs(Date.now() / 1000 - timestampNumber) > MAX_CLOCK_SKEW_SECONDS
  ) {
    return Response.json({ error: "Webhook timestamp is invalid." }, { status: 401 });
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  if (!safeEqual(expected, provided)) {
    return Response.json({ error: "Webhook signature is invalid." }, { status: 401 });
  }

  let event: { id?: string; type?: string };
  try {
    event = JSON.parse(body) as { id?: string; type?: string };
  } catch {
    return Response.json({ error: "Webhook body is invalid." }, { status: 400 });
  }
  if (!event.id || !event.type) {
    return Response.json({ error: "Webhook event is incomplete." }, { status: 400 });
  }

  revalidateTag("public-vehicles", "max");
  return Response.json({ accepted: true, event_id: event.id });
}

function safeEqual(expected: string, provided: string) {
  if (!/^[a-f0-9]{64}$/.test(provided)) {
    return false;
  }
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(provided, "hex"));
}
