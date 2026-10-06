"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getCurrentProfile } from "@/lib/supabase/server";
import { removePushSubscription, savePushSubscription, sendPushToUser } from "@/lib/push";

export type PushActionResult = { ok: true; message?: string } | { ok: false; error: string };

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(1000),
  keys: z.object({
    p256dh: z.string().min(1).max(200),
    auth: z.string().min(1).max(100),
  }),
});

export async function subscribePush(input: unknown): Promise<PushActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, error: "Please sign in again." };

  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "This browser sent an invalid subscription." };

  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  try {
    await savePushSubscription(
      profile.id,
      { endpoint: parsed.data.endpoint, ...parsed.data.keys },
      userAgent,
    );
    return { ok: true };
  } catch (err) {
    console.error("subscribePush:", err);
    return { ok: false, error: "Couldn't save this device. Try again." };
  }
}

export async function unsubscribePush(endpoint: string): Promise<PushActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, error: "Please sign in again." };
  if (typeof endpoint !== "string" || endpoint.length > 1000) {
    return { ok: false, error: "Invalid device." };
  }
  await removePushSubscription(profile.id, endpoint);
  return { ok: true };
}

export async function sendTestPush(): Promise<PushActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, error: "Please sign in again." };

  try {
    const reached = await sendPushToUser(profile.id, {
      title: "OnVex alerts are on",
      body: "This is a test. You'll get alerts like this for site issues, messages and due tasks.",
      url: "/admin/notifications",
      tag: "onvex-test",
    });
    if (reached === 0) return { ok: false, error: "No devices have alerts turned on yet." };
    return { ok: true, message: reached === 1 ? "Sent to 1 device." : `Sent to ${reached} devices.` };
  } catch (err) {
    console.error("sendTestPush:", err);
    return { ok: false, error: "Couldn't send the test alert." };
  }
}
